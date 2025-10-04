async function getVideo(){
  const url=document.getElementById('url').value.trim();
  if(!url){alert('Link डालो!'); return;}
  showSpin(true);
  document.getElementById('msg').innerText='';
  try{
    const dlp=await YTDlp.create();
    const info=await dlp.getInfo(url);
    const blob=await dlp.download(url,{format:'mp4-720p'});
    saveAs(blob,info.title.replace(/[^a-z0-9]/gi,'_')+'.mp4');
    document.getElementById('msg').innerText='✅ Done!';
  }catch(e){
    document.getElementById('msg').innerText='❌ '+e.message;
  }finally{
    showSpin(false);
  }
}
