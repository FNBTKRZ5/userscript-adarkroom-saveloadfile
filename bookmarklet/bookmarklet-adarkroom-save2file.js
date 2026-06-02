(function(){
  'use strict';
  const stylem=document.createElement("style");
  stylem.id="svFile-hidePanel";
  stylem.innerHTML = `#event {display:none !important;}
#svFile-Panel { z-index:99999;
  border:solid 2px #000; padding:2px 15px;
  background-color:#fff;
  position:fixed; margin:0;
  transform:translate(-50%,-50%);left:50%;top:30%;
  width:min(80vw,500px); user-select:none;
  & h1 {font-size:min(6vw, 26px);}
  & p {font-size:min(4vw, 17px);}
  & button {
    margin-bottom:15px;font-family:monospace;font-size:11px;
    padding:4px;
    &:active {background-color:#888;color:#fff;border-radius:4px;}
    &:not(:first-of-type) {
      margin-left:7px;
    }
  }
  --mgbottom:35px;
  & input[type="file"]:not(:has(+ label)) {
    margin-bottom:var(--mgbottom);
  }
}`;
  document.head.appendChild(stylem);

  let savebtn;
  for (const i of document.getElementsByClassName("menuBtn")) {
    if (i.textContent == "save.") savebtn = i;
  }
  if (!!savebtn) {
    savebtn.click();
    document.getElementById("export").click();
    const svData = document.querySelector("#description textarea").value;
    document.querySelector("#exitButtons .cooldown").click();

    const Data_blob = new Blob([svData], {
      type: "text/plain"
    });
    const blob_url = URL.createObjectURL(Data_blob);

    const panelElm = document.createElement("dialog");
    panelElm.id = "svFile-Panel";
    let celm = document.createElement("h1");
    celm.textContent = "Save is exported as a file.";
    panelElm.appendChild(celm);
    celm = document.createElement("p");
    const celm_pa = document.createElement("a");
    celm_pa.textContent = "click here";
    celm_pa.href = blob_url;
    const cdt = new Date();
    celm_pa.download = "adarkroom-save-export_"
    + cdt.getFullYear() + new String(cdt.getMonth()+1).padStart(2, 0)
    + new String(cdt.getDate()).padStart(2, 0)
    + "-" + new String(cdt.getHours()).padStart(2, 0)
    + new String(cdt.getMinutes()).padStart(2, 0) + new String(cdt.getSeconds()).padStart(2, 0)
    + ".txt";
    celm.append("If the download didn't automatically start, please ", celm_pa, ".");
    panelElm.appendChild(celm);
    celm = document.createElement("button");
    celm.textContent = "Close this panel.";
    celm.onclick = () => {
      window.URL.revokeObjectURL(blob_url);
      panelElm.remove();
      stylem.remove();
    };
    panelElm.appendChild(celm);
    document.body.appendChild(panelElm);
    panelElm.showModal();
    celm_pa.click();

  } else {
    alert("unable to find the save button, check the issue in the script.");
    console.error("ERROR [userscript]: unable to find the save button element, please check any issue in the script.");
  }
})();