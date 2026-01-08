const fs=require('fs');
const path=require('path');
const cp=require('child_process');
const root=path.resolve(__dirname,'..');
const projectDir=path.join(root,'todolist_uniapp');
const minipDir=path.join(root,'main_miniprogram');
const destMain=path.join(minipDir,'subpackages','todolist');
const standaloneRoot=path.join(projectDir,'weapp');
function pickOfficialSrc(){
  const c=[
    path.join(projectDir,'unpackage','dist','dev','mp-weixin'),
    path.join(projectDir,'unpackage','dist','build','mp-weixin'),
    path.join(projectDir,'dist','dev','mp-weixin'),
    path.join(projectDir,'dist','build','mp-weixin'),
    path.join(projectDir,'dist')
  ];
  for(const p of c){if(fs.existsSync(p))return p}
  return null;
  
}
function ensureDir(p){if(!fs.existsSync(p))fs.mkdirSync(p,{recursive:true})}
function copyDir(src,dst){ensureDir(dst);for(const name of fs.readdirSync(src)){const s=path.join(src,name);const d=path.join(dst,name);const st=fs.statSync(s);if(st.isDirectory()){copyDir(s,d)}else{ensureDir(path.dirname(d));fs.copyFileSync(s,d)}}}
function writeProjCfg(dest){const p=path.join(dest,'project.config.json');const cfg={packNpmManually:true,setting:{minified: true},appid:""};fs.writeFileSync(p,JSON.stringify(cfg,null,2),'utf8')}
function ensureStandalone(){
  ensureDir(standaloneRoot);
  // 写入独立小程序必要文件
  const appJson={ pages:["pages/index/index"], window:{ navigationBarTitleText:"TodoList" } };
  fs.writeFileSync(path.join(standaloneRoot,'app.json'),JSON.stringify(appJson,null,2),'utf8');
  fs.writeFileSync(path.join(standaloneRoot,'app.js'),'App({})','utf8');
  fs.writeFileSync(path.join(standaloneRoot,'app.wxss'),'', 'utf8');
  // 复制页面目录
  const srcPages=path.join(minipDir,'subpackages','todolist','pages');
  const dstPages=path.join(standaloneRoot,'pages');
  if(fs.existsSync(srcPages)) copyDir(srcPages,dstPages);
}
function runOnce(){
  const args=process.argv.slice(2).join(' ');
  const toStandalone=args.includes('--target standalone');
  const updateWorkshop=args.includes('--updateWorkshop');

  let realSrc=null;
  if(toStandalone){
    ensureStandalone();
    realSrc=standaloneRoot;
  }else{
    realSrc=pickOfficialSrc();
    if(!realSrc){
      console.warn('未找到官方构建目录，请先在 todolist_uniapp 中运行官方构建（如：vite build --watch 或 HBuilderX 的 mp-weixin 运行）');
      return false;
    }
  }

  const dest=toStandalone?standaloneRoot:destMain;
  ensureDir(dest);
  copyDir(realSrc,dest);
  writeProjCfg(dest);
  console.log(toStandalone?'已同步 todolist 到独立 weapp：':'已同步 todolist 到主包：',dest);

  if(updateWorkshop){
    try{cp.execFileSync('node',[path.join(root,'scripts','gen-workshop.js')],{stdio:'inherit'});}catch(e){console.warn('更新创意工坊列表失败:',e.message)}
  }
  return true
}
function watchLoop(){let ok=false;setInterval(()=>{try{ok=runOnce()||ok}catch(e){console.warn('同步失败:',e.message)}},2000)}
const args=process.argv.join(' ');
if(args.includes('--watch')){watchLoop()}else{if(!runOnce())process.exit(1)}