async function getVideo(){
  const url = document.getElementById('url').value.trim();
  if(!url){alert('Link डालो!'); return;}
  document.getElementById('msg').innerText = 'रुको… डाउनलोड हो रहा है';
  try{
    const dlp = await YTDlp.create();
    const info = await dlp.getInfo(url);
    const blob = await dlp.download(url,{format:'mp4-720p'});
    saveAs(blob, info.title+'.mp4');
    document.getElementById('msg').innerText = '✅ हो गया!';
  }catch(e){
    document.getElementById('msg').innerText = '❌ Error: '+e.message;
  }
}
