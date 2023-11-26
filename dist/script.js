"use strict";const HtmlSanitizer=new function(){const _tagWhitelist={A:!0,ABBR:!0,B:!0,BLOCKQUOTE:!0,BODY:!0,BR:!0,CENTER:!0,CODE:!0,DD:!0,DIV:!0,DL:!0,DT:!0,EM:!0,FONT:!0,H1:!0,H2:!0,H3:!0,H4:!0,H5:!0,H6:!0,HR:!0,I:!0,IMG:!0,LABEL:!0,LI:!0,OL:!0,P:!0,PRE:!0,SMALL:!0,SOURCE:!0,SPAN:!0,STRONG:!0,SUB:!0,SUP:!0,TABLE:!0,TBODY:!0,TR:!0,TD:!0,TH:!0,THEAD:!0,UL:!0,U:!0,VIDEO:!0},_contentTagWhiteList={FORM:!0,"GOOGLE-SHEETS-HTML-ORIGIN":!0},_attributeWhitelist={align:!0,color:!0,controls:!0,height:!0,href:!0,id:!0,src:!0,style:!0,target:!0,title:!0,type:!0,width:!0,class:!0},_cssWhitelist={"background-color":!0,color:!0,"font-size":!0,"font-weight":!0,"text-align":!0,"text-decoration":!0,width:!0},_schemaWhiteList=["http:","https:","data:","m-files:","file:","ftp:","mailto:","pw:"],_uriAttributes={href:!0,action:!0},_parser=new DOMParser;this.SanitizeHtml=function(input,extraSelector){if(""==(input=input.trim()))return"";if("<br>"==input)return"";-1==input.indexOf("<body")&&(input="<body>"+input+"</body>");let doc=_parser.parseFromString(input,"text/html");return"BODY"!==doc.body.tagName&&doc.body.remove(),"function"!=typeof doc.createElement&&doc.createElement.remove(),function makeSanitizedCopy(node){let newNode;if(node.nodeType==Node.TEXT_NODE)newNode=node.cloneNode(!0);else if(node.nodeType==Node.ELEMENT_NODE&&(_tagWhitelist[node.tagName]||_contentTagWhiteList[node.tagName]||extraSelector&&node.matches(extraSelector))){newNode=_contentTagWhiteList[node.tagName]?doc.createElement("DIV"):doc.createElement(node.tagName);for(let i=0;i<node.attributes.length;i++){var attr=node.attributes[i];if(_attributeWhitelist[attr.name])if("style"==attr.name)for(let s=0;s<node.style.length;s++){var styleName=node.style[s];_cssWhitelist[styleName]&&newNode.style.setProperty(styleName,node.style.getPropertyValue(styleName))}else _uriAttributes[attr.name]&&-1<attr.value.indexOf(":")&&!function(str,substrings){for(let i=0;i<substrings.length;i++)if(0==str.indexOf(substrings[i]))return 1}(attr.value,_schemaWhiteList)||newNode.setAttribute(attr.name,attr.value)}for(let i=0;i<node.childNodes.length;i++){var subCopy=makeSanitizedCopy(node.childNodes[i]);newNode.appendChild(subCopy,!1)}}else newNode=doc.createDocumentFragment();return newNode}(doc.body).innerHTML.replace(/<br[^>]*>(\S)/g,"<br>\n$1").replace(/div><div/g,"div>\n<div")},this.AllowedTags=_tagWhitelist,this.AllowedAttributes=_attributeWhitelist,this.AllowedCssStyles=_cssWhitelist,this.AllowedSchemas=_schemaWhiteList};var i,j,k,playerPosition,board=document.getElementById("boardContainerID"),textContainer=document.getElementById("textContainerID"),boardSize=7,nMoves=0,lifeTime=1e3,sleepTime=100,nExperiments=1,avgMoves=0,avgPegsRemaining=0,starsId="starsCSS",wavesId="wavesCSS",boardHistory=[],boardState="";const startingState="111111111111111101111111111111111";var cellMapping=new Map,InitializeBoard=()=>{for(i=0;i<boardSize;++i){var row=document.createElement("div");for(row.setAttribute("id","rowID"),row.className="row",j=0;j<boardSize;++j){var cell=document.createElement("div");cell.setAttribute("id",""+i+j),cell.className="cell",row.appendChild(cell)}board.appendChild(row)}for(i=0;i<boardSize;++i)for(j=0;j<boardSize;++j){var peg;i==Math.floor(boardSize/2)&&j==Math.floor(boardSize/2)||((peg=document.createElement("span")).className="peg",document.getElementById(""+i+j).appendChild(peg))}},GetValidMoves=playerPosition=>{return!InsideBoard(playerPosition)||IsEmpty(playerPosition)?[]:[[-2,0],[2,0],[0,-2],[0,2]].reduce((validMoves,offset)=>{offset=Add(playerPosition,offset);return InsideBoard(offset)&&IsEmpty(offset)&&validMoves.push(offset),validMoves},[])},MovePeg=(startPos,endPos)=>{var peg;return GetValidMoves(startPos).find(move=>Equal(move,endPos))?(RemovePeg(endPos),RemovePeg(startPos),RemovePeg(FindBetweenPeg(startPos,endPos)),(peg=document.createElement("span")).className="movedPeg",document.getElementById(""+endPos[0]+endPos[1]).appendChild(peg),nMoves++,UpdateStats(),!0):(console.log("Attempted invalid move ",startPos,endPos),console.log("Valid moves were ",GetValidMoves(startPos)),!1)},MovePegForce=(startPos,endPos)=>{RemovePeg(endPos),RemovePeg(startPos),RemovePeg(FindBetweenPeg(startPos,endPos));startPos=document.createElement("span");startPos.className="movedPeg",document.getElementById(""+endPos[0]+endPos[1]).appendChild(startPos)},Add=(a,b)=>[a[0]+b[0],a[1]+b[1]],Equal=(a,b)=>a[0]==b[0]&&a[1]==b[1],InsideBoard=position=>!(position[0]<0||6<position[0]||position[1]<0||6<position[1]||(position[0]<2&&position[1]<2||position[0]<2&&4<position[1]||4<position[0]&&position[1]<2||4<position[0]&&4<position[1])),IsEmpty=position=>!document.getElementById(""+position[0]+position[1]).hasChildNodes(),RemovePeg=position=>{position=document.getElementById(""+position[0]+position[1]);position.firstChild&&position.removeChild(position.firstChild)},FindBetweenPeg=(startingPos,EndPos)=>startingPos[0]===EndPos[0]&&startingPos[1]<EndPos[1]?[startingPos[0],startingPos[1]+1]:startingPos[0]===EndPos[0]&&startingPos[1]>EndPos[1]?[startingPos[0],startingPos[1]-1]:startingPos[1]===EndPos[1]&&startingPos[0]<EndPos[0]?[startingPos[0]+1,startingPos[1]]:startingPos[1]===EndPos[1]&&startingPos[0]>EndPos[0]?[startingPos[0]-1,startingPos[1]]:void 0,MoveablePegsActual=()=>{let moveablePegs=new Set;var allowedMoves=AllowedMoves();let moveablePegsList=[];return allowedMoves.forEach(([source])=>{moveablePegs.add(""+source[0]+source[1])}),moveablePegs.forEach(move=>{moveablePegsList.push([Number(move[0]),Number(move[1])])}),moveablePegsList},MoveablePegs=()=>{var moveablePegs=[];for(let i=0;i<boardSize;++i)for(let j=0;j<boardSize;++j)GetValidMoves([i,j]).length&&moveablePegs.push([i,j]);return moveablePegs},AllowedMoves=()=>{let allowedMoves=[];return MoveablePegs().forEach(startPos=>{GetValidMoves(startPos).forEach(endPos=>{IsEmpty(FindBetweenPeg(startPos,endPos))||allowedMoves.push([startPos,endPos])})}),allowedMoves},RandomMove=()=>{var allowedMoves=AllowedMoves();allowedMoves.length&&(allowedMoves=allowedMoves[Math.floor(Math.random()*allowedMoves.length)],MovePeg(allowedMoves[0],allowedMoves[1]))},EmptyPegs=()=>{let count=0;for(let i=0;i<boardSize;++i)for(let j=0;j<boardSize;++j)InsideBoard([i,j])&&IsEmpty([i,j])&&count++;return count},ClearCells=()=>{for(let i=0;i<boardSize;++i)for(let j=0;j<boardSize;++j)document.getElementById(""+i+j).className="cell"},ClearListeners=()=>{for(let i=0;i<boardSize;++i)for(let j=0;j<boardSize;++j){var lastMove=document.getElementById(""+i+j).firstChild;lastMove&&"movedPeg"===lastMove.className&&(lastMove.className="peg")}board.innerHTML=board.innerHTML},UpdateStats=()=>{textContainer.textContent=`
  ${nMoves} move(s) done 

  Pegs Remaining :  ${33-EmptyPegs()}
  `},UpdateReport=()=>{textContainer.textContent=`
  Report
  Strategy : Greedy with Random Moves
  Number of Experiments : ${nExperiments}
  Average Moves per experiment : ${avgMoves/nExperiments}
  Average No of Pegs remaining : ${avgPegsRemaining/nExperiments}
  `},UpdateDfsReport=(steps,time)=>{textContainer.textContent=`
  Report
  Strategy : DFS
  Number of states explored : ${steps}
  Time taken : ${time} ms
  `};const sleep=ms=>new Promise(r=>setTimeout(r,ms));var ResetBoard=()=>{nMoves=0,board.replaceChildren(),InitializeBoard()},RunGame=async()=>{for(k=0;k<lifeTime&&AllowedMoves().length;k++)RandomMove(),await sleep(sleepTime)},RunExperiment=async days=>{updateStatusWithDot("Random Agent : Running"),document.getElementById("randomBtn").style.display="none",document.getElementById("dfsBtn").style.display="none",document.getElementById("manualBtn").style.display="none",nExperiments=days,avgPegsRemaining=avgMoves=0,ResetBoard();for(let k=0;k<nExperiments;++k)ResetBoard(),await RunGame(),avgMoves+=nMoves,avgPegsRemaining+=33-EmptyPegs();UpdateReport(),updateStatusWithDot("Idle")},InitThemeSwitch=()=>{var userPrefersDark=window.matchMedia("(prefers-color-scheme: dark)")["matches"],userPrefersDark=localStorage.getItem("theme")?localStorage.getItem("theme"):userPrefersDark?"dark":"light",toggle=(document.body.className="dark"===userPrefersDark?"dark-mode":"",localStorage.setItem("theme",userPrefersDark),HandleThemeCSSLoading(userPrefersDark),document.getElementById("toggleInputID"));toggle.checked="dark"===userPrefersDark,toggle.addEventListener("change",e=>{e=e.target.checked?"dark":"light";document.body.className="dark"==e?"dark-mode":"",localStorage.setItem("theme",e),HandleThemeCSSLoading(e)})},LoadStars=()=>{var head,link;document.getElementById(starsId)||(head=document.getElementsByTagName("head")[0],(link=document.createElement("link")).id=starsId,link.rel="stylesheet",link.type="text/css",link.href="stars.css",link.media="all",head.appendChild(link))},RemoveStars=()=>{document.getElementById(starsId)?.remove()},LoadWaves=()=>{var head,link;document.getElementById(wavesId)||(head=document.getElementsByTagName("head")[0],(link=document.createElement("link")).id=wavesId,link.rel="stylesheet",link.type="text/css",link.href="waves.css",link.media="all",head.appendChild(link))},RemoveWaves=()=>{document.getElementById(wavesId)?.remove()},HandleThemeCSSLoading=theme=>{("dark"===theme?(RemoveWaves(),LoadStars):(RemoveStars(),LoadWaves))()},GetBoardState=()=>{let state="";for(let i=0;i<boardSize;++i)for(let j=0;j<boardSize;++j)InsideBoard([i,j])&&(state+=IsEmpty([i,j])?"0":"1");return state},SetBoardState=state=>{for(board.replaceChildren(),i=0;i<boardSize;++i){var row=document.createElement("div");for(row.setAttribute("id","rowID"),row.className="row",j=0;j<boardSize;++j){var cell=document.createElement("div");cell.setAttribute("id",""+i+j),cell.className="cell",row.appendChild(cell)}board.appendChild(row)}let counter=0;for(let i=0;i<boardSize;++i)for(let j=0;j<boardSize;++j){var peg;InsideBoard([i,j])&&("1"==state[counter]&&((peg=document.createElement("span")).className="peg",document.getElementById(""+i+j).appendChild(peg)),counter++)}},UndoMove=()=>{1<boardHistory.length&&(SetBoardState(boardHistory.at(-2)),boardHistory.pop(),userMoves--,PrepareSourceInput())},sourcePeg=(InitThemeSwitch(),InitializeBoard(),textContainer.textContent=`
  Welcome to Peg Solitaire ! 

  Click on the buttons below to start
`,boardHistory.push(startingState),[-1,-1]),userMoves=0,ManualMode=()=>{ResetBoard(),updateStatusWithDot("Manual Mode"),document.getElementById("undoBtn").style.display="unset",document.getElementById("randomBtn").style.display="none",document.getElementById("dfsBtn").style.display="none",document.getElementById("manualBtn").style.display="none",PrepareSourceInput()},PrepareSourceInput=()=>{ClearListeners();const abortSourceControllers=new AbortController;AllowedMoves().length?(textContainer.textContent=`
      ${userMoves} moves done
      ${AllowedMoves().length} legal moves can be performed 
    `,MoveablePegsActual().forEach(peg=>{const pegElement=document.getElementById(""+peg[0]+peg[1]).firstChild;pegElement.className="moveablePeg",pegElement.draggable=!0,pegElement.addEventListener("mouseover",()=>{pegElement.click()}),pegElement.addEventListener("touchstart",e=>{e.preventDefault(),pegElement.click()}),pegElement.addEventListener("click",function(){pegElement.className="selectedPeg",sourcePeg=[peg[0],peg[1]],MoveablePegsActual().forEach(remainingPeg=>{Equal(peg,remainingPeg)||(document.getElementById(""+remainingPeg[0]+remainingPeg[1]).firstChild.className="peg")}),abortSourceControllers.abort(),PrepareDestinationInput()})})):(32==EmptyPegs()?(textContainer.textContent=` 
    Completed Successfully ! 

    ${userMoves} move(s) done
    `,document.getElementById("celebrations").style.display=""):textContainer.textContent=` 
      Finished
      ${userMoves} move(s) done 

      Pegs Remaining :  ${33-EmptyPegs()}
      `,document.getElementById("undoBtn").style.display="none",updateStatusWithDot("Idle"),(boardHistory=[]).push(startingState))},PrepareDestinationInput=()=>{ClearListeners();const abortDestinationControllers=new AbortController;var allowedMoves=AllowedMoves();let allowedDestinations=new Set;allowedMoves.forEach(([source,destination])=>{Equal(sourcePeg,source)&&allowedDestinations.add(""+destination[0]+destination[1])}),allowedDestinations.forEach(destination=>{const destinationElement=document.getElementById(""+destination[0]+destination[1]);destinationElement.addEventListener("click",function(){RemovePeg(sourcePeg),RemovePeg([Number(destination[0]),Number(destination[1])]),RemovePeg(FindBetweenPeg(sourcePeg,[Number(destination[0]),Number(destination[1])])),ClearCells();var peg=document.createElement("span");peg.className="movedPeg",destinationElement.appendChild(peg),userMoves++,boardHistory.push(GetBoardState()),abortDestinationControllers.abort(),PrepareSourceInput()}),destinationElement.addEventListener("dragover",e=>{e.preventDefault()},{passive:!1}),destinationElement.addEventListener("drop",e=>{e.preventDefault(),RemovePeg(sourcePeg),RemovePeg([Number(destination[0]),Number(destination[1])]),RemovePeg(FindBetweenPeg(sourcePeg,[Number(destination[0]),Number(destination[1])])),ClearCells();e=document.createElement("span");e.className="movedPeg",destinationElement.appendChild(e),userMoves++,boardHistory.push(GetBoardState()),abortDestinationControllers.abort(),PrepareSourceInput()},{signal:abortDestinationControllers.signal}),destinationElement.className="allowedCell"});allowedMoves=document.getElementById(""+sourcePeg[0]+sourcePeg[1]);allowedMoves.addEventListener("mouseout",function(){ClearCells(),abortDestinationControllers.abort(),PrepareSourceInput()}),allowedMoves.addEventListener("touchstart",function(e){e.preventDefault(),ClearCells(),abortDestinationControllers.abort(),PrepareSourceInput()}),allowedMoves.addEventListener("drag",function(e){e.target.classList.add("dragging")}),allowedMoves.addEventListener("dragend",function(e){e.target.classList.remove("dragging")})},FullReset=()=>{"Idle"===document.getElementById("status").textContent||"Manual Mode"===document.getElementById("status").textContent?(sourcePeg=[-1,-1],userMoves=0,ResetBoard(),textContainer.textContent=`
  Welcome to Peg Solitaire ! 

  Click on the buttons below to start
    `,updateStatusWithDot("Idle"),document.getElementById("undoBtn").style.display="none",document.getElementById("randomBtn").style.display="unset",document.getElementById("dfsBtn").style.display="unset",document.getElementById("manualBtn").style.display="unset",(boardHistory=[]).push(startingState)):window.location.reload()};function updateStatusWithDot(text){document.getElementById("status").textContent=text;var dotElement=document.getElementById("statusDot"),text=text.toLowerCase();text.includes("idle")?dotElement.style.backgroundColor="green":text.includes("running")||text.includes("exploring")?dotElement.style.backgroundColor="red":dotElement.style.backgroundColor="blue"}class PegSolitaire{constructor(initialState){this.initialState=initialState,this.visited=[],this.memoryMap=new Map,this.execTime=0}dfs(board){const stack=[{board:board,steps:0}];for(;0<stack.length;){const{board,steps}=stack.pop();if(SetBoardState(board),33-EmptyPegs()==1)return!0;this.visited.includes(board)||this.visited.push(board),AllowedMoves().forEach(([from,to])=>{SetBoardState(board),MovePeg(from,to);from=GetBoardState();this.memoryMap.set(from,board),this.visited.includes(from)||stack.push({board:from,steps:steps+1})})}return!1}findSolution(){var startTime=performance.now(),foundSolution=this.dfs(this.initialState);this.execTime=performance.now()-startTime,foundSolution||console.log("No solution found.")}reconstructPath(){var path=["000000000000000010000000000000000"];let u=this.memoryMap.get("000000000000000010000000000000000");for(;u;)path.push(u),u=this.memoryMap.get(u);return path.reverse()}}var MakeMap=()=>{let count=-1;for(let i=0;i<7;i++)for(let j=0;j<7;j++)InsideBoard([i,j])&&(++count,cellMapping.set(""+i+j,count))},RunDFS=()=>{ResetBoard(),updateStatusWithDot("DFS : Exploring"),document.getElementById("randomBtn").style.display="none",document.getElementById("dfsBtn").style.display="none",document.getElementById("manualBtn").style.display="none",textContainer.textContent="Exploring...",requestAnimationFrame(()=>{requestAnimationFrame(()=>{var pegSolitaireGame=new PegSolitaire(startingState);MakeMap(),pegSolitaireGame.findSolution(),displayDfsSolution(pegSolitaireGame)})})},displayDfsSolution=async pegSolitaireGame=>{UpdateDfsReport(pegSolitaireGame.visited.length,pegSolitaireGame.execTime),ResetBoard();var solutionPath=pegSolitaireGame.reconstructPath();updateStatusWithDot("DFS : Displaying"),await sleep(2e3);for(let i=1;i<solutionPath.length;++i){var m=findMove(solutionPath[i-1],solutionPath[i]);MovePegForce(m[0],m[1]),await sleep(1e3)}pegSolitaireGame=null,updateStatusWithDot("Idle")},findMove=(oldBoard,newBoard)=>{const oldArray=oldBoard.split("").map(Number),newArray=newBoard.split("").map(Number);oldBoard=oldArray.reduce((acc,value,index)=>(value!==newArray[index]&&acc.push(index),acc),[]).map(val=>{return[...cellMapping].find(([,value])=>val===value)[0]}),newBoard=oldBoard.find(peg=>0===oldArray[cellMapping.get(peg)]);return[oldBoard[0]===newBoard?[Number(oldBoard[2][0]),Number(oldBoard[2][1])]:[Number(oldBoard[0][0]),Number(oldBoard[0][1])],[Number(newBoard[0]),Number(newBoard[1])]]},ValidMoveChecker=(startingPos,EndPos)=>startingPos[0]===EndPos[0]&&2===Math.abs(startingPos[1]-EndPos[1])||startingPos[1]===EndPos[1]&&2===Math.abs(startingPos[0]-EndPos[0])||(console.log("Invalid move found : ",startingPos,EndPos),!1);