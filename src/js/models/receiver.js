import hlsconfig from "../config/hlsConfig";
class Receiver {
  constructor(id, config) {
    this.context = null;
    this.playerManager = null;
    this.castDebugLogger = null;
    this.appId = config.appId;
    this.video = document.querySelector(id);
    this.playbackConfig = null;
    this.controls = null;
    this.hls = null;
    this.videoObject = null;
  }
  start() {
    this.play();
  }

  play() {
    this.video
      .play()
      .then(() => {
        alert("playing");
      })
      .catch(() => {});
  }
  attachMedia() {
    vpPlayer.HLSsupported = Hls.isSupported();
    this.video.playbackRate = 1;

    if (this.videoObject.file.endsWith("mp4")) {
      this.video.src = this.videoObject.file;
      this.start();
    } else if (vpPlayer.HLSsupported && !Utils.isIOS()) {
      this.hls = new Hls(config);
      this.hls.attachMedia(this.video);

      this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
        this.hls.startLevel = this.videoObject.live
          ? 0
          : Utils.getStartLevel(this.videoObject.duration);
        this.hls.loadSource(this.videoObject.file);
        this.seekToLive = true;
      });

      this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        if (Utils.isSafari()) {
          this.video.src = this.videoObject.file;
          fps_drm.init(
            this.video,
            config.fpsCertificateUrl,
            this.videoObject.assetId
          );
        } else {
          this.qualityLevels = this.hls.levels;
        }
        this.start();

        this.hls.loadLevel =
          this.config.quality != undefined
            ? Math.min(this.config.quality, this.hls.levels.length - 1)
            : -1;
        this.seekToLive = true;
      });

      this.hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.details === "manifestLoadError") {
          this.videoContainer.classList.add(cssClasses.effects.hideContent);
          this.videoContainer.classList.add(cssClasses.effects.showError);
        }

        if (data.details === "manifestLoadTimeOut") {
          this.videoContainer.classList.add(cssClasses.effects.hideContent);
          this.videoContainer.classList.add(cssClasses.effects.showError);
        }

        if (data.details === "manifestParsingError") {
          this.videoContainer.classList.add(cssClasses.effects.hideContent);
          this.videoContainer.classList.add(cssClasses.effects.showError);
        }

        if (data.details === "levelLoadError") {
          this.removeLevel(data.context.level);
        }

        if (data.details === "fragLoadError") {
          this.fragErrorCount++;
          // sn referes to sequence number
          if (data.frag.sn == 0) this.failedToLoadFirstFragment = true;
        }

        if (this.levelHasMissingFragments()) {
          this.fragErrorCount = 0;
          this.removeLevel(data.frag.level);
          this.hls.loadLevel = -1;
          console.log("Network error encountered");
        }

        if (this.failedToLoadFirstFragment) {
          this.failedToLoadFirstFragment = false;
          this.removeLevel(data.frag.level);
          this.hls.loadLevel = -1;
          this.onPlay();
          console.log("Network error encountered");
        }

        if (!data.fatal) {
          return;
        }

        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.log("fatal network error encountered");
            this.hls.startLoad();
            break;
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.log("fatal media error encountered");
            this.hls.recoverMediaError();
            break;
          default:
            this.hls.destroy();
            break;
        }
      });
    } else if (this.video.canPlayType("application/vnd.apple.mpegurl")) {
      this.video.src = this.videoObject.file;
      if (Utils.isIOS()) {
        fps_drm.init(
          this.video,
          config.fpsCertificateUrl,
          this.videoObject.assetId
        );
      }
      this.video.playsInline = true;
      this.start();
    }
  }
  fakeinit() {
    const context = cast.framework.CastReceiverContext.getInstance();
    const playerManager = context.getPlayerManager();
    context.start();
  }
  init() {
    this.context = cast.framework.CastReceiverContext.getInstance();
    this.playerManager = this.context.getPlayerManager();
    this.castDebugLogger = cast.debug.CastDebugLogger.getInstance();
    // this.playbackConfig.autoResumeDuration = 5;
    // this.castDebugLogger.info(
    //   LOG_RECEIVER_TAG,
    //   `autoResumeDuration set to: ${playbackConfig.autoResumeDuration}`
    // );
    // this.controls.clearDefaultSlotAssignments();
    // this.drawButtons();

    // context.start({
    //   queue: new CastQueue(),
    //   playbackConfig: this.playbackConfig,
    //   supportedCommands:
    //     cast.framework.messages.Command.ALL_BASIC_MEDIA |
    //     cast.framework.messages.Command.QUEUE_PREV |
    //     cast.framework.messages.Command.QUEUE_NEXT |
    //     cast.framework.messages.Command.STREAM_TRANSFER,
    // });
  }
  drawButtons() {
    this.controls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_SECONDARY_1,
      cast.framework.ui.ControlsButton.QUEUE_PREV
    );
    this.controls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_PRIMARY_1,
      cast.framework.ui.ControlsButton.CAPTIONS
    );
    this.controls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_PRIMARY_2,
      cast.framework.ui.ControlsButton.SEEK_FORWARD_15
    );
    this.controls.assignButton(
      cast.framework.ui.ControlsSlot.SLOT_SECONDARY_2,
      cast.framework.ui.ControlsButton.QUEUE_NEXT
    );
  }

  bindInterceptors() {
    this.playerManager.setMessageInterceptor(
      cast.framework.messages.MessageTyep.LOAD,
      this.onLoadRequest
    );
  }
  bindMethodd() {
    this.bindInterceptors = this.bindInterceptors.bind(this);
    this.init = this.init.bind(this);
    this.drawButtons = this.drawButtons.bind(this);
    this.onLoadRequest = this.onLoadRequest.bind(this);
    this.attachMedia = this.attachMedia.bind(this);
  }
  onLoadRequest(loadRequestData) {
    castDebugLogger.debug(
      LOG_RECEIVER_TAG,
      `loadRequestData: ${JSON.stringify(loadRequestData)}`
    );

    // If the loadRequestData is incomplete return an error message
    if (!loadRequestData || !loadRequestData.media) {
      const error = new cast.framework.messages.ErrorData(
        cast.framework.messages.ErrorType.LOAD_FAILED
      );
      error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
      return error;
    }

    // check all content source fields for asset URL or ID
    let source =
      loadRequestData.media.contentUrl ||
      loadRequestData.media.entity ||
      loadRequestData.media.contentId;

    this.videoObject.file = source;
    this.attachMedia();
    return loadRequestData;
    // If there is no source or a malformed ID then return an error.
    if (!source || source == "" || !source.match(ID_REGEX)) {
      let error = new cast.framework.messages.ErrorData(
        cast.framework.messages.ErrorType.LOAD_FAILED
      );
      error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
      return error;
    }

    let sourceId = source.match(ID_REGEX)[1];

    // Add breaks to the media information and set the contentUrl
    return addBreaks(loadRequestData.media)
      .then(() => {
        // If the source is a url that points to an asset don't fetch from backend
        if (sourceId.includes(".")) {
          castDebugLogger.debug(
            LOG_RECEIVER_TAG,
            "Interceptor received full URL"
          );
          loadRequestData.media.contentUrl = source;
          return loadRequestData;
        }

        // Fetch the contentUrl if provided an ID or entity URL
        else {
          castDebugLogger.debug(LOG_RECEIVER_TAG, "Interceptor received ID");
          return this.fetchMediaById(sourceId).then((item) => {
            let metadata = new cast.framework.messages.GenericMediaMetadata();
            metadata.title = item.title;
            metadata.subtitle = item.description;
            loadRequestData.media.contentId = item.stream.dash;
            loadRequestData.media.contentType = "application/dash+xml";
            loadRequestData.media.metadata = metadata;
            return loadRequestData;
          });
        }
      })
      .catch((errorMessage) => {
        let error = new cast.framework.messages.ErrorData(
          cast.framework.messages.ErrorType.LOAD_FAILED
        );
        error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
        castDebugLogger.error(LOG_RECEIVER_TAG, errorMessage);
        return error;
      });
  }
  addBreaks(mediaInformation) {
    castDebugLogger.debug(
      LOG_RECEIVER_TAG,
      "addBreaks: " + JSON.stringify(mediaInformation)
    );
    return fetchMediaById("fbb_ad").then((clip1) => {
      mediaInformation.breakClips = [
        {
          id: "fbb_ad",
          title: clip1.title,
          contentUrl: clip1.stream.dash,
          contentType: "application/dash+xml",
          whenSkippable: 5,
        },
      ];

      mediaInformation.breaks = [
        {
          id: "pre-roll",
          breakClipIds: ["fbb_ad"],
          position: 0,
        },
      ];
    });
  }
  fetchMediaById(id) {
    castDebugLogger.debug(LOG_RECEIVER_TAG, "fetching id: " + id);

    return new Promise((accept, reject) => {
      fetch(CONTENT_URL)
        .then((response) => response.json())
        .then((obj) => {
          if (obj) {
            if (obj[id]) {
              accept(obj[id]);
            } else {
              reject(`${id} not found in repository`);
            }
          } else {
            reject("Content repository not found.");
          }
        });
    });
  }
}

export default Receiver;
