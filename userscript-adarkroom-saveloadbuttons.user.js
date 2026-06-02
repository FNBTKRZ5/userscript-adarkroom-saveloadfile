// ==UserScript==
// @name         adarkroom - save and load through a file
// @namespace    https://github.com/FNBTKRZ5
// @version      1.0
// @description  Export/Import the save as a file.
// @author       FNBTKRZ5
// @license      GPLv2 only
// @run-at       document-idle
// @match        https://adarkroom.doublespeakgames.com/
// @grant        none
// @noframes
// ==/UserScript==

(function() {
  'use strict';
  
  // code for the button event
  function getFilesvld(loadsaveopt, inpval) {
    const stylem = document.createElement("style");
    stylem.id = "svFile-hidePanel";
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
      if (loadsaveopt === "save") {
        savebtn.click();
        document.getElementById("export").click();
        const svData = document.querySelector("#description textarea").value;
        document.querySelector("#exitButtons .cooldown").click();
        
        const Data_blob = new Blob([svData], { type:"text/plain" });
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
          + cdt.getFullYear() + new String(cdt.getMonth()+1).padStart(2,0)
          + new String(cdt.getDate()).padStart(2,0)
          + "-" + new String(cdt.getHours()).padStart(2,0)
          + new String(cdt.getMinutes()).padStart(2,0) + new String(cdt.getSeconds()).padStart(2,0)
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
      } else if (loadsaveopt === "load") {
        const panelElm = document.createElement("dialog");
        panelElm.id = "svFile-Panel";
        let celm = document.createElement("h1");
        celm.textContent = "Pick a file to be imported.";
        panelElm.appendChild(celm);
        const icelm = document.createElement("input");
        icelm.type = "file";
        icelm.accept = "text/plain";
        if (!!inpval) icelm.files = inpval.files;
        icelm.style = "display:block;";
        panelElm.appendChild(icelm);
        celm = document.createElement("button");
        celm.textContent = "Cancel";
        celm.onclick = () => {
          panelElm.remove();
          stylem.remove();
        };
        panelElm.appendChild(celm);
        celm = document.createElement("button");
        celm.textContent = "Import from selected file";const telm = document.createElement("label");
        telm.htmlFor = "loadFilesv";
        telm.style = "color:red;font-size:12px;display:block;margin-bottom:calc(var(--mgbottom) - 16px);margin-top:4px;";
        celm.onclick = async function(){
          if (icelm.files.length == 0) {
            telm.textContent = "Please select a file first.";
            if (!document.querySelector("input + label")) icelm.after(telm);
            return;
          }
          const fread = new FileReader();
          fread.onload = () => {
            telm.remove();
            let fContent = fread.result;
            if (!!fContent) nextloadproc(fContent);
            else console.error("ERROR [userscript]: unable to retrieve content from the selected file.");
          };
          fread.onerror = () => {
            telm.textContent = "ERROR: File reader unable to load.";
            if (!document.querySelector("input + label")) icelm.after(telm);
            console.error("reader failed to load.");
          };
          fread.readAsText(icelm.files[0]);
          function nextloadproc(fContent) {
            if (!!fContent) {
              console.log(`Selected file info:\nFile name: ${icelm.files[0].name}\nFile content:\n${fContent}`);
              const preserverVal = new DataTransfer();
              preserverVal.items.add(icelm.files[0]);
              const confelm = new DocumentFragment();
              let confcel = document.createElement("h1");
              confcel.textContent = "You sure?";
              confelm.appendChild(confcel);
              confcel = document.createElement("p");
              confcel.append("Please make sure you've selected the correct file, an error would just reset all of your current progress and there's no going back.", document.createElement("br"));
              let confcel_c = document.createElement("strong");
              confcel_c.textContent = "Note:";
              confcel.append(confcel_c, "You can see the console in the devtool to check the content from the file.")
              confelm.appendChild(confcel);
              confcel = document.createElement("button");
              confcel.textContent = "go back";
              confcel.onclick = () => {
                panelElm.remove();
                getFilesvld("load", preserverVal);
              };
              confelm.appendChild(confcel);
              confcel = document.createElement("button");
              confcel.textContent = "ye";
              confcel.onclick = () => {
                savebtn.click();
                document.getElementById("import").click();
                document.getElementById("yes").click();
                document.querySelector("#description textarea").value = fContent;
                document.getElementById("okay").click();
              };
              confelm.appendChild(confcel);
              panelElm.replaceChildren(confelm);
            }
          }
        };
        panelElm.appendChild(celm);
        document.body.appendChild(panelElm);
        panelElm.showModal();
      }
      
    } else {
      alert("unable to find the save button, check the issue in the script.");
      console.error("ERROR [userscript]: unable to find the save button element, please check any issue in the script.");
    }
    return;
  }
  
  //added the buttons for ui
  const buttonsContainer = document.createElement("div");
  buttonsContainer.style = "padding:8px;border:solid 1px #000;width:fit-content;position:absolute;left:2px;top:2px;";
  buttonsContainer.id = "FileSaveLoad_buttons";
  const buttonSave = document.createElement("button");
  buttonSave.textContent = "Save2File";
  buttonSave.style = "display:block;";
  buttonSave.onclick = ()=> {getFilesvld("save")};
  buttonsContainer.appendChild(buttonSave);
  const buttonLoad = document.createElement("button");
  buttonLoad.textContent = "File2Load";
  buttonLoad.style = "display:block;margin-top:10px";
  buttonLoad.onclick = ()=> {getFilesvld("load")};
  buttonsContainer.appendChild(buttonLoad);
  document.body.appendChild(buttonsContainer);
})();