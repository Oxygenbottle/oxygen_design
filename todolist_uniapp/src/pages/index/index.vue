<template>
  <view class="container">
    <view class="title">TodoList 1111</view>
    <view class="input-row">
      <input
        class="input"
        placeholder="输入待办1"
        :value="input"
        @input="onInput"
        @confirm="addTodo"
      />
      <button class="btn" @tap="addTodo">添加</button>
    </view>
    <view class="list">
      <block v-for="item in todos" :key="item.id">
        <view class="item" @tap="toggle(item.id)">
          <text :class="['text', item.done ? 'done' : '']">{{ item.text }}</text>
          <button class="del" @tap.stop="remove(item.id)">删除</button>
        </view>
      </block>
    </view>
    <view class="empty" v-if="todos.length === 0">暂无待办</view>
  </view>
</template>
<script>
export default {
  data(){
    return { input:'', todos:[] }
  },
  onLoad(){
    try{
      const s=uni.getStorageSync('todolist');
      this.todos=Array.isArray(s)?s:[]
    }catch(e){ this.todos=[] }
  },
  methods:{
    onInput(e){ this.input=e.detail.value },
    addTodo(){
      const t=(this.input||'').trim();
      if(!t) return;
      this.todos=[{id:Date.now(),text:t,done:false},...this.todos];
      this.input='';
      try{uni.setStorageSync('todolist',this.todos)}catch(e){}
    },
    toggle(id){
      this.todos=this.todos.map(x=>x.id===id?Object.assign({},x,{done:!x.done}):x);
      try{uni.setStorageSync('todolist',this.todos)}catch(e){}
    },
    remove(id){
      this.todos=this.todos.filter(x=>x.id!==id);
      try{uni.setStorageSync('todolist',this.todos)}catch(e){}
    }
  }
}
</script>
<style>
.container {
  padding: 16px;
}
.title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}
.input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}
.input {
  flex: 1;
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 6px;
  background: #fff;
}
.btn {
  padding: 8px 12px;
  background: #00e6a8;
  color: #000;
  border-radius: 6px;
}
.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background: #fff;
}
.text {
  color: #222;
}
.text.done {
  text-decoration: line-through;
  color: #888;
}
.del {
  background: #ffebee;
  color: #c62828;
  border-radius: 6px;
  padding: 6px 10px;
}
.empty {
  color: #888;
  text-align: center;
  margin-top: 16px;
}
</style>
