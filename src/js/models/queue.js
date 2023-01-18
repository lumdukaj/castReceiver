class Queue extends cast.framework.QueueBase {
  constructor() {
    super();
    this.LOG_QUEUE_TAG = "Queue";
    this.castdebugLogger = cast.debug.CastDebugLogger.getInstance();
  }
  initialize(loadRequestData) {
    if (loadRequestData) {
      let queueData = loadRequestData.queueData;
      if (!queueData || !queueData.items || !queueData.items.length) {
        castDebugLogger.info(
          LOG_QUEUE_TAG,
          "Creating a new queue with media from the load request"
        );
        queueData = new cast.framework.messages.QueueData();
        let item = new cast.framework.messages.QueueItem();
        item.media = loadRequestData.media;
        queueData.items = [item];
      }
      return queueData;
    }
  }
  nextItems(referenceItemId) {
    // Return sample content.
    let item = new cast.framework.messages.QueueItem();
    item.media = new cast.framework.messages.MediaInformation();
    item.media.entity = "https://sample.com/audios/bbb";
    item.media.customData = { isSuggested: true };
    return [item];
  }
  prevItems(referenceItemId) {
    // Return sample content.
    let item = new cast.framework.messages.QueueItem();
    item.media = new cast.framework.messages.MediaInformation();
    item.media.entity = "https://sample.com/audios/ed";
    item.media.customData = { isSuggested: true };
    return [item];
  }
}

export default Queue;
