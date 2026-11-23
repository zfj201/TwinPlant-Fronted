<template>
  <aside class="packet-detail">
    <div class="head">
      <span class="title">报文详情</span>
    </div>
    <div class="body"></div>
  </aside>
</template>

<style scoped lang="less">
.packet-detail {
  display: flex;
  flex: none;
  flex-direction: column;
  width: 250px;
  height: 100%;
  overflow: hidden;
  border-left: 1px solid rgba(5, 5, 5, 0.06);

  .head {
    display: flex;
    flex: none;
    align-items: center;
    box-sizing: border-box;
    height: 56px;
    padding: 0 16px;
    border-bottom: 1px solid rgba(5, 5, 5, 0.06);

    .title {
      font-size: 16px;
      font-weight: 600;
    }
  }

  .body {
    flex: 1;
    min-height: 0;
    padding: 16px;
    overflow: auto;
  }
}
</style>
