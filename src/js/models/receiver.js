import hlsconfig from "../config/hlsConfig";
import ReceiverControls from "./receiver-controls";
class Receiver {
  constructor(id, config) {
    this.context = null;
    this.playerManager = null;
    this.castDebugLogger = null;
    this.appId = config.appId;
    this.audio = document.querySelector(id);
    this.playbackConfig = null;
    this.controls = null;
    this.hls = null;
    this.audioObject = {};
    this.audioContainer = this.audio.parentElement;
    this.playbackRate = 1;
    this.autoplay = false;
    this.receiverControls = new ReceiverControls(".controls");
    this.mediaManager = null;
    this.castReceiverManager = null;
    this.audioStarted = false;
  }
  start() {
    this.receiverControls.loader.style.display = "none";
    this.onPlay();
  }

  onPlay() {
    // return this.playerManager.play();
    this.audio
      .play()
      .then(() => {
        if (!this.audioStarted) {
          this.receiverControls.showControls();
          this.audioStarted = true;
        } else {
          this.receiverControls.play();
        }
        this.receiverControls.hideControls(6000);
      })
      .catch(() => {});
  }
  onPause() {
    this.audio.pause();
    this.receiverControls.pause();
    this.receiverControls.showControls();
  }
  addPlayerEvents() {
    this.audio.addEventListener("timeupdate", this.onTimeUpdate);
  }
  onTimeUpdate() {
    this.receiverControls.update(this.updatePlayerState());
  }
  updatePlayerState() {
    return {
      currentTime: this.audio.currentTime,
      duration: this.audioObject.duration,
    };
  }
  attachMedia() {
    vpReceiver.HLSsupported = Hls.isSupported();
    this.castDebugLogger.debug("inside attach media", vpReceiver.HLSsupported);
    this.audio.playbackRate = 1;
    this.castDebugLogger.debug(
      "audio file",
      JSON.stringify(this.audio, ["id", "className", "tagName"])
    );
    if (this.audioObject.file.endsWith("mp3")) {
      this.castDebugLogger.debug("inside mp3", this.audioObject.file);
      this.audio.src = this.audioObject.file;
      this.start();
    } else if (vpReceiver.HLSsupported) {
      this.castDebugLogger.debug("inside hlssupported", this.audioObject.file);
      try {
        this.hls = new Hls();
        this.castDebugLogger.debug("hls initialized", this.audioObject.file);
        if (this.currentTime > 0) this.audio.currentTime = this.currentTime;
        this.hls.attachMedia(this.audio);
        this.castDebugLogger.debug("attached media", this.audioObject.file);

        this.hls.on(Hls.Events.MEDIA_ATTACHED, () => {
          this.castDebugLogger.debug("amedia attached", this.audioObject.file);
          this.hls.startLevel = 0;
          this.castDebugLogger.debug(
            "loading source hlssupported",
            this.audioObject.file
          );
          this.hls.loadSource(this.audioObject.file);
        });
        this.hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
          this.castDebugLogger.debug("manifest parsed", this.audioObject.file);
          this.start();
        });
        this.hls.on(Hls.Events.ERROR, (event, data) => {
          this.castDebugLogger.debug("HLS  ERROR", data.details);
        });
      } catch (error) {
        this.castDebugLogger.debug("hls error", error);
      }

      // this.hls.on(Hls.Events.ERROR, (event, data) => {
      //   if (data.details === "manifestLoadError") {
      //     this.audioContainer.classList.add(cssClasses.effects.hideContent);
      //     this.audioContainer.classList.add(cssClasses.effects.showError);
      //   }

      //   if (data.details === "manifestLoadTimeOut") {
      //     this.audioContainer.classList.add(cssClasses.effects.hideContent);
      //     this.audioContainer.classList.add(cssClasses.effects.showError);
      //   }

      //   if (data.details === "manifestParsingError") {
      //     this.audioContainer.classList.add(cssClasses.effects.hideContent);
      //     this.audioContainer.classList.add(cssClasses.effects.showError);
      //   }

      //   if (data.details === "levelLoadError") {
      //     this.removeLevel(data.context.level);
      //   }

      //   if (data.details === "fragLoadError") {
      //     this.fragErrorCount++;
      //     // sn referes to sequence number
      //     if (data.frag.sn == 0) this.failedToLoadFirstFragment = true;
      //   }

      //   if (this.levelHasMissingFragments()) {
      //     this.fragErrorCount = 0;
      //     this.removeLevel(data.frag.level);
      //     this.hls.loadLevel = -1;
      //     console.log("Network error encountered");
      //   }

      //   if (this.failedToLoadFirstFragment) {
      //     this.failedToLoadFirstFragment = false;
      //     this.removeLevel(data.frag.level);
      //     this.hls.loadLevel = -1;
      //     this.onPlay();
      //     console.log("Network error encountered");
      //   }

      //   if (!data.fatal) {
      //     return;
      //   }

      //   switch (data.type) {
      //     case Hls.ErrorTypes.NETWORK_ERROR:
      //       console.log("fatal network error encountered");
      //       this.hls.startLoad();
      //       break;
      //     case Hls.ErrorTypes.MEDIA_ERROR:
      //       console.log("fatal media error encountered");
      //       this.hls.recoverMediaError();
      //       break;
      //     default:
      //       this.hls.destroy();
      //       break;
      //   }
      // });
    }
    this.castDebugLogger.debug("finished attach media");
    //  else if (this.audio.canPlayType("application/vnd.apple.mpegurl")) {
    //   this.audio.src = this.audioObject.file;
    //   if (Utils.isIOS()) {
    //     fps_drm.init(
    //       this.audio,
    //       config.fpsCertificateUrl,
    //       this.audioObject.assetId
    //     );
    //   }
    //   this.audio.playsInline = true;
    //   this.start();
    // }
  }
  fakeinit() {
    const context = cast.framework.CastReceiverContext.getInstance();
    const playerManager = context.getPlayerManager();
    this.castDebugLogger = {
      debug: function (type, message) {
        console.debug(type, message);
      },
    };
    this.receiverControls.setCastDebugger(this.castDebugLogger);
    this.audioObject.file =
      "https://vp.gjirafa.net/vps/prod/odgehtyo/encode/vjsmylds/mp3/360p.mp3";
    this.attachMedia();
    this.bindMethods();
    // this.bindInterceptors();
    this.addPlayerEvents();
    context.start();
  }
  init() {
    this.context = cast.framework.CastReceiverContext.getInstance();

    this.context.setLoggerLevel(cast.framework.LoggerLevel.DEBUG);
    this.playerManager = this.context.getPlayerManager();
    this.playerManager.setMediaElement(this.audio);
    this.castDebugLogger = cast.debug.CastDebugLogger.getInstance();
    this.castDebugLogger.setEnabled(true);
    this.castDebugLogger.debug("hello", "okej");

    this.receiverControls.setCastDebugger(this.castDebugLogger);
    // this.playbackConfig.autoResumeDuration = 5;
    // this.castDebugLogger.info(LOG_RECEIVER_TAG, `autoinit: `);
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
    // this.bindInterceptors();
    // this.audioObject.file =
    //   "https://vp.gjirafa.net/vps/prod/odgehtyo/encode/vjsmylds/mp3/360p.mp3";
    // this.attachMedia();
    this.context.start();
    this.bindMethods();
    this.bindInterceptors();
    this.addPlayerEvents();
  }
  onSeek(requestData) {
    this.audio.currentTime = requestData.currentTime;
    this.receiverControls.showControls();
    this.receiverControls.hideControls(6000);

    this.receiverControls.update(this.updatePlayerState());
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
      cast.framework.messages.MessageType.LOAD,
      this.onLoadRequest.bind(this)
    );
    this.playerManager.setMessageInterceptor(
      cast.framework.messages.MessageType.PLAY,
      this.onPlay.bind(this)
    );
    this.playerManager.setMessageInterceptor(
      cast.framework.messages.MessageType.PAUSE,
      this.onPause.bind(this)
    );
    this.playerManager.setMessageInterceptor(
      cast.framework.messages.MessageType.SEEK,
      this.onSeek.bind(this)
    );
  }
  bindMethods() {
    this.bindInterceptors = this.bindInterceptors.bind(this);
    this.onLoadRequest = this.onLoadRequest.bind(this);
    this.attachMedia = this.attachMedia.bind(this);
    this.start = this.start.bind(this);
    this.addPlayerEvents = this.addPlayerEvents.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.updatePlayerState = this.updatePlayerState.bind(this);
  }
  onLoadRequest(loadRequestData) {
    // If the loadRequestData is incomplete return an error message
    // if (!loadRequestData || !loadRequestData.media) {
    //   const error = new cast.framework.messages.ErrorData(
    //     cast.framework.messages.ErrorType.LOAD_FAILED
    //   );
    //   error.reason = cast.framework.messages.ErrorReason.INVALID_REQUEST;
    //   return error;
    // }

    // // check all content source fields for asset URL or ID
    // let source =
    //   loadRequestData.media.contentUrl ||
    //   loadRequestData.media.entity ||
    //   loadRequestData.media.contentId;
    this.castDebugLogger.debug("VPreceiver", loadRequestData.media.contentId);
    this.castDebugLogger.debug("VPreceiver1", Hls.isSupported());
    this.audioObject.file = loadRequestData.media.contentId;
    this.audioObject.duration = loadRequestData.media.metadata.duration;
    this.currentTime = loadRequestData.currentTime;
    this.playbackRate = loadRequestData.playbackRate;
    this.autoplay = loadRequestData.autoplay;
    this.attachMedia();
    return null;
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
