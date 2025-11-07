<template>
  <view class="post-item">
    <view class="user-info">
      <image :src="post.avatar" mode="aspectFit" class="user-avatar"></image>
      <view class="user-details">
        <view class="user-name">
          {{ post.username }}
          <text v-if="post.official" class="official-tag">官方</text>
          <text v-if="post.verified && !post.official" class="verified-tag">✓</text>
        </view>
        <view class="post-time">{{ post.postTime }}</view>
      </view>
    </view>
    <view class="post-content">
      <text v-if="post.title" class="post-title">{{ post.title }}</text>
      <text class="post-text">{{ post.content }}</text>
      <view v-if="post.media" class="post-media">
        <image
          :src="post.media.src"
          mode="aspectFill"
          class="video-cover"
        ></image>
        <view v-if="post.media.duration" class="video-duration">{{ post.media.duration }}</view>
      </view>
      <view v-if="post.stats" class="post-stats">
        <text class="play-count">{{ post.stats.playCount }}</text>
        <text class="comment-count">{{ post.stats.commentCount }}</text>
      </view>
    </view>
    <view v-if="post.actions" class="post-actions">
      <view class="action-item">
        <text class="action-icon">💬</text>
        <text>{{ post.actions.commentCount }}</text>
      </view>
      <view class="action-item">
        <text class="action-icon">👍</text>
        <text>{{ post.actions.likeCount }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'postItem',
  props: {
    post: {
      type: Object,
      required: false
    }
  }
};
</script>

<style lang="scss" scoped>
/* 帖子样式 */
.post-item {
  width: 100%;
  background: #fff;
  border-radius: 20rpx;
  padding: 24rpx;
  margin-bottom: 20rpx;
  box-sizing: border-box;

  .user-info {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;

    .user-avatar {
      width: 70rpx;
      height: 70rpx;
      border-radius: 50%;
      margin-right: 20rpx;
    }

    .user-details {
      flex: 1;

      .user-name {
        font-size: 28rpx;
        font-weight: 500;
        color: #333;

        .official-tag {
          display: inline-block;
          margin-left: 8rpx;
          padding: 0 10rpx;
          height: 24rpx;
          line-height: 24rpx;
          background-color: #71aff7;
          color: #fff;
          font-size: 20rpx;
          border-radius: 12rpx;
        }

        .verified-tag {
          color: #71aff7;
          margin-left: 8rpx;
        }
      }

      .post-time {
        font-size: 24rpx;
        color: #999;
        margin-top: 6rpx;
      }
    }
  }

  .post-content {
    .post-title {
      font-size: 30rpx;
      font-weight: 500;
      color: #333;
      margin-bottom: 16rpx;
      display: block;
    }

    .post-text {
      font-size: 28rpx;
      color: #666;
      line-height: 1.5;
      margin-bottom: 20rpx;
      display: block;
    }

    .post-media {
      width: 100%;
      height: 400rpx;
      position: relative;
      background-color: #f0f0f0;
      border-radius: 16rpx;
      overflow: hidden;

      .video-cover {
        width: 100%;
        height: 100%;
      }

      .video-duration {
        position: absolute;
        bottom: 10rpx;
        right: 10rpx;
        background-color: rgba(0, 0, 0, 0.5);
        color: #fff;
        font-size: 24rpx;
        padding: 4rpx 10rpx;
        border-radius: 16rpx;
      }
    }

    .post-stats {
      display: flex;
      margin-top: 16rpx;

      .play-count,
      .comment-count {
        font-size: 24rpx;
        color: #999;
        margin-right: 24rpx;
      }
    }
  }

  .post-actions {
    display: flex;
    justify-content: space-around;
    margin-top: 20rpx;
    padding-top: 20rpx;
    border-top: 1rpx solid #f0f0f0;

    .action-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 24rpx;
      color: #999;

      .action-icon {
        font-size: 40rpx;
        margin-bottom: 6rpx;
      }
    }
  }
}
</style>