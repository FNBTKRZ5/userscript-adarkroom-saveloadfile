(function() {
  'use strict';
  function getFilesvld(inpval) {
    let stylem;
    if (!document.getElementById("svFile-hidePanel")) {
      stylem = document.createElement("style");stylem.id = "svFile-hidePanel";
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
      }`; document.head.appendChild(stylem);
    } else stylem=document.getElementById("svFile-hidePanel");

    let savebtn;
    for (const i of document.getElementsByClassName("menuBtn")) {
      if (i.textContent == "save.") savebtn = i;
    }
    if (!!savebtn) {
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
      celm.textContent = "Import from selected file"; const telm = document.createElement("label");
      telm.htmlFor = "loadFilesv";
      telm.style = "color:red;font-size:12px;display:block;margin-bottom:calc(var(--mgbottom) - 16px);margin-top:4px;";
      celm.onclick = async function() {
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
            confcel.append(confcel_c, "You can see the console in the devtool to check the content from the file.");
            confelm.appendChild(confcel);
            confcel = document.createElement("button");
            confcel.textContent = "go back";
            confcel.onclick = () => {
              panelElm.remove();
              getFilesvld(preserverVal);
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
              stylem.remove(); panelElm.remove();
            };
            confelm.appendChild(confcel);
            panelElm.replaceChildren(confelm);
          }
        }
      };
      panelElm.appendChild(celm);
      document.body.appendChild(panelElm);
      panelElm.showModal();

    } else {
      alert("unable to find the save button, check the issue in the script.");
      console.error("ERROR [userscript]: unable to find the save button element, please check any issue in the script.");
    }
    return;
  }getFilesvld();
})();