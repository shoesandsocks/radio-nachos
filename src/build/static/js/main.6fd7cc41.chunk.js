(this["webpackJsonpreact-app"]=this["webpackJsonpreact-app"]||[]).push([[0],{12:function(e,t,a){},13:function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(6),i=a.n(r),c=(a(12),a(1)),o=a(2);var s=function(){var e=Object(n.useState)(20),t=Object(o.a)(e,2),a=t[0],r=t[1],i=Object(n.useState)([["",100,""]]),s=Object(o.a)(i,2),m=s[0],u=s[1],p=Object(n.useState)({playlists:[],compositions:[]}),d=Object(o.a)(p,2),y=d[0],f=d[1],h=Object(n.useState)(""),g=Object(o.a)(h,2),v=g[0],E=g[1],b=Object(n.useState)(!1),w=Object(o.a)(b,2),k=w[0],N=w[1];Object(n.useEffect)((function(){fetch("/getPrev").then((function(e){return e.json()})).then((function(e){return f(e)})).catch((function(e){return console.log(e),O("Error. Are you logged in?")}))}),[]);var O=function(e){return N(!1),setTimeout((function(){return E("")}),7e3),E(e)},S=function(e){var t=e.target,a=t.name,n=t.value;if("tracks"===a&&r(n),a.match(/^playlist/)){var l=a.replace("playlist","").toString(),i=Object(c.a)(m);return i[l][0]=n,void(n.match(/^spotify:playlist:[a-zA-Z0-9]{22}$/)?function(e,t,a,n,l){fetch("/playlistlookup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({str:e})}).then((function(e){return e.json()})).then((function(e){var r=e.error,i=e.name;l(r);var o=Object(c.a)(a);return o[t][2]=i||"",n(o)})).catch((function(e){return l("Lookup failed. Are you logged in?")}))}(n,l,m,u,O):(i[l][2]="",u(i)))}if(a.match(/^percent/)){var o=a.replace("percent","").toString(),s=Object(c.a)(m);s[o][1]=n,u(s)}},j=function(e){var t=Object(c.a)(m);t.push(["",0]),u(t)},C=function(e){var t=m.filter((function(t,a){return a!==Number(e.target.value)}));u(t)},T=function(e){return e.reduce((function(e,t){return e+Number(t[1])}),0)};return l.a.createElement("div",{className:"App"},l.a.createElement("h1",null,"radio nachos playmaker"),l.a.createElement("form",{id:"creator-form"},l.a.createElement("fieldset",{id:"fieldset"},l.a.createElement("div",{id:"all-entries"},m.map((function(e,t){return function(e,t,a,n,r){var i=arguments.length>5&&void 0!==arguments[5]&&arguments[5],c=!(arguments.length>6&&void 0!==arguments[6])||arguments[6];return l.a.createElement("div",{key:e},l.a.createElement("div",{className:"above-entry-wrap"},l.a.createElement("p",{className:"label-spacer"}),l.a.createElement("p",{className:"playlist-name-lookup",id:"playlist1-name-lookup"},t[2])),l.a.createElement("div",{className:"one-entry-wrap"},l.a.createElement("label",{htmlFor:"playlist".concat(e)},"playlist ID"),l.a.createElement("input",{type:"text",name:"playlist".concat(e),id:"playlist".concat(e),className:"playlist-id","data-lpignore":"true",required:!0,placeholder:"spotify:playlist:37i9dQZF1DZ06evO05tE88",value:t[0],onChange:a}),l.a.createElement("input",{type:"number",className:"percentage",id:"percent".concat(e),name:"percent".concat(e),value:t[1],min:"1",max:"100",step:"1",onChange:a}),l.a.createElement("label",{htmlFor:"percent".concat(e)},"%"),l.a.createElement("button",{type:"button",className:"add-entry-button ".concat(i?"":"visually-hidden"),id:"add-entry-button-".concat(e),value:e,onClick:n},"add more"),!c&&l.a.createElement("button",{type:"button",className:"remove-entry-button",id:"remove-entry-button-".concat(e),value:e,onClick:r},"remove this")))}(t,e,S,j,C,t===m.length-1,1===m.length)}))),l.a.createElement("p",{id:"total"},T(m)),l.a.createElement("p",{id:"currentVal"},a),l.a.createElement("label",{htmlFor:"tracks"},"how many tracks? (10 - 99)"),l.a.createElement("br",null),l.a.createElement("input",{type:"range",id:"tracks-input",name:"tracks",value:a,min:"10",max:"99",step:"1",onChange:S}),l.a.createElement("br",null),l.a.createElement("div",{id:"count-and-button"},l.a.createElement("span",{id:"global-error"},v),l.a.createElement("button",{id:"submit-btn",type:"submit",onClick:function(e){return e.preventDefault(),N(!0),100!==T(m)?O("C'mon. That's not 100%, Brad."):m.filter((function(e){return 3!==e.length})).length>0?O("You missed a playlist, there."):m.map((function(e){return e[2]})).includes("")?O("Missing a valid playlist there?"):void fetch("/make",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({arrayOfArrays:m,numberOfTracks:a})}).then((function(e){return e.json()})).then((function(e){var t=e.listId,a=e.timestamp,n=e.error;if(n)return O(n);var l=new URL(window.location.href);return window.location.href="".concat(l.origin,"/radio?listId=").concat(t,"&timestamp=").concat(a)})).catch((function(e){return console.log(e),O("Serious failure; sorry.")}))},disabled:k},k?l.a.createElement("span",null,l.a.createElement("svg",{id:"spinner",xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"#ffffff"},l.a.createElement("path",{d:"M19 8l-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3l-4-4zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4H6z"}))):"create playlist")))),l.a.createElement("h2",null,"Previous playlists"),l.a.createElement("ul",{id:"previous"},!y.playlists.length&&l.a.createElement("li",null,l.a.createElement("p",{id:"nope"},"you have no previous playlists")),function(e,t,a){var n=function(e){var n=JSON.parse(e.target.dataset.composition),l=e.target.dataset.tracks,r=n.map((function(e){return[e.playlistId,e.percentage,e.playlistName]}));t(r),a(l),window.scrollTo({top:0,left:0,behavior:"smooth"})},r=function(e){var t=e.target.id.replace("playlist-","");fetch("/deletePlaylist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToDelete:t})}).then((function(e){200===e.status?window.location.reload():alert("Something went wrong. Server status: ".concat(e.status))})).catch((function(e){alert("Something went wrong. ".concat(JSON.stringify(e)))}))};try{var i=e.playlists,c=e.compositions;return i.map((function(e){var t=e.id,a=+e.name.split("-")[2],i=new Date(a),o="https://www.porknachos.com/files/naviavi.jpg";e.images&&e.images.length>1&&(o=e.images[1].url);var s=c.filter((function(e){return e.timestamp===a.toString()}))[0],m="".concat(i.toLocaleTimeString(),", ").concat(i.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"short",day:"numeric"}));if(void 0!==s){var u=s.compositionData,p=s.numberOfTracks;return!p||p<1?l.a.createElement("li",{key:t,className:"playlist-entry-wrap"},l.a.createElement("a",{href:"/radio?timestamp=".concat(a,"&listId=").concat(t)},l.a.createElement("img",{src:o,alt:"playlist graphic from spotify"}),l.a.createElement("p",null,"An empty playlist")),l.a.createElement("div",{className:"playlist-buttons"},l.a.createElement("div",null,"\xa0"),l.a.createElement("button",{onClick:r,className:"delete-playlist-btn",id:"playlist-".concat(t)},"delete this playlist")),"`"):l.a.createElement("li",{key:t,className:"playlist-entry-wrap"},l.a.createElement("a",{href:"/radio?timestamp=".concat(a,"&listId=").concat(t)},l.a.createElement("img",{src:o,alt:"playlist graphic from spotify"}),l.a.createElement("p",null,m," - ",p," songs")),u.map((function(e){return l.a.createElement("p",{key:e.playlistId,className:"one-playlist-line"},e.playlistName," (",e.playlistId,")",l.a.createElement("span",null,e.percentage,"%"))})),l.a.createElement("div",{className:"playlist-buttons"},l.a.createElement("button",{className:"make-another-btn","data-composition":JSON.stringify(u),"data-tracks":p,onClick:n},"Set up a similar playlist"),l.a.createElement("button",{onClick:r,className:"delete-playlist-btn",id:"playlist-".concat(t)},"delete this playlist")),"`")}return l.a.createElement("li",{className:"playlist-entry-wrap"},l.a.createElement("a",{href:"/radio?timestamp=".concat(a,"&listId=").concat(t)},l.a.createElement("img",{src:"".concat(e.images[1].url),alt:"playlist graphic from spotify"}),l.a.createElement("p",null,"$",m)))}))}catch(o){return console.log(o,"error mapping playlists"),l.a.createElement("p",null,"Something failed catastrophically. If you have a blank radio-nachos playlist in your Spotify account, delete it."," ",l.a.createElement("a",{href:"/"},"Try logging in again.")," You might need to message me.")}}(y,u,r)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(s,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},7:function(e,t,a){e.exports=a(13)}},[[7,1,2]]]);
//# sourceMappingURL=main.6fd7cc41.chunk.js.map