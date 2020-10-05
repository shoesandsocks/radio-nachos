(this["webpackJsonpreact-app"]=this["webpackJsonpreact-app"]||[]).push([[0],{12:function(e,t,a){},13:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),l=a(6),i=a.n(l),c=(a(12),a(1)),o=a(2);var s=function(){var e=Object(n.useState)(20),t=Object(o.a)(e,2),a=t[0],l=t[1],i=Object(n.useState)([["",100,""]]),s=Object(o.a)(i,2),m=s[0],u=s[1],p=Object(n.useState)({playlists:[],compositions:[]}),d=Object(o.a)(p,2),y=d[0],f=d[1],h=Object(n.useState)(""),g=Object(o.a)(h,2),v=g[0],b=g[1],E=Object(n.useState)(!1),k=Object(o.a)(E,2),w=k[0],N=k[1];Object(n.useEffect)((function(){fetch("/getPrev").then((function(e){return e.json()})).then((function(e){return f(e)})).catch((function(e){return console.log(e),O("Error. Are you logged in?")}))}),[]);var O=function(e){return N(!1),setTimeout((function(){return b("")}),7e3),b(e)},S=function(e){var t=e.target,a=t.name,n=t.value;if("tracks"===a&&l(n),a.match(/^playlist/)){var r=a.replace("playlist","").toString(),i=Object(c.a)(m);return i[r][0]=n,void(n.match(/^spotify:playlist:[a-zA-Z0-9]{22}$/)?function(e,t,a,n,r){fetch("/playlistlookup",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({str:e})}).then((function(e){return e.json()})).then((function(e){var l=e.error,i=e.name;r(l);var o=Object(c.a)(a);return o[t][2]=i||"",n(o)})).catch((function(e){return r("Lookup failed. Are you logged in?")}))}(n,r,m,u,O):(i[r][2]="",u(i)))}if(a.match(/^percent/)){var o=a.replace("percent","").toString(),s=Object(c.a)(m);s[o][1]=n,u(s)}},j=function(e){var t=Object(c.a)(m);t.push(["",0]),u(t)},T=function(e){var t=m.filter((function(t,a){return a!==Number(e.target.value)}));u(t)},C=function(e){return e.reduce((function(e,t){return e+Number(t[1])}),0)};return r.a.createElement("div",{className:"App"},r.a.createElement("h1",null,"radio nachos playmaker"),r.a.createElement("form",{id:"creator-form"},r.a.createElement("fieldset",{id:"fieldset"},r.a.createElement("div",{id:"all-entries"},m.map((function(e,t){return function(e,t,a,n,l){var i=arguments.length>5&&void 0!==arguments[5]&&arguments[5],c=!(arguments.length>6&&void 0!==arguments[6])||arguments[6];return r.a.createElement("div",{key:e},r.a.createElement("div",{className:"above-entry-wrap"},r.a.createElement("p",{className:"label-spacer"}),r.a.createElement("p",{className:"playlist-name-lookup",id:"playlist1-name-lookup"},t[2])),r.a.createElement("div",{className:"one-entry-wrap"},r.a.createElement("label",{htmlFor:"playlist".concat(e)},"playlist ID"),r.a.createElement("input",{type:"text",name:"playlist".concat(e),id:"playlist".concat(e),className:"playlist-id","data-lpignore":"true",required:!0,placeholder:"spotify:playlist:37i9dQZF1DZ06evO05tE88",value:t[0],onChange:a}),r.a.createElement("input",{type:"number",className:"percentage",id:"percent".concat(e),name:"percent".concat(e),value:t[1],min:"1",max:"100",step:"1",onChange:a}),r.a.createElement("label",{htmlFor:"percent".concat(e)},"%"),r.a.createElement("button",{type:"button",className:"add-entry-button ".concat(i?"":"visually-hidden"),id:"add-entry-button-".concat(e),value:e,onClick:n},"add more"),!c&&r.a.createElement("button",{type:"button",className:"remove-entry-button",id:"remove-entry-button-".concat(e),value:e,onClick:l},"remove this")))}(t,e,S,j,T,t===m.length-1,1===m.length)}))),r.a.createElement("p",{id:"total"},C(m)),r.a.createElement("p",{id:"currentVal"},a),r.a.createElement("label",{htmlFor:"tracks"},"how many tracks? (10 - 99)"),r.a.createElement("br",null),r.a.createElement("input",{type:"range",id:"tracks-input",name:"tracks",value:a,min:"10",max:"99",step:"1",onChange:S}),r.a.createElement("br",null),r.a.createElement("div",{id:"count-and-button"},r.a.createElement("span",{id:"global-error"},v),r.a.createElement("button",{id:"submit-btn",type:"submit",onClick:function(e){return e.preventDefault(),N(!0),100!==C(m)?O("C'mon. That's not 100%, Brad."):m.map((function(e){return e[2]})).includes("")?O("Missing a valid playlist there?"):void fetch("/make",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({arrayOfArrays:m,numberOfTracks:a})}).then((function(e){return e.json()})).then((function(e){var t=e.listId,a=e.timestamp,n=e.error;if(n)return O(n);var r=new URL(window.location.href);return window.location.href="".concat(r.origin,"/radio?listId=").concat(t,"&timestamp=").concat(a)})).catch((function(e){return console.log(e),O("Serious failure; sorry.")}))},disabled:w},w?"~ ~ ~ ~ ~ ~":"create playlist")))),r.a.createElement("h2",null,"Previous playlists"),r.a.createElement("ul",{id:"previous"},!y.playlists.length&&r.a.createElement("li",null,r.a.createElement("p",{id:"nope"},"you have no previous playlists")),function(e,t,a){var n=function(e){var n=JSON.parse(e.target.dataset.composition),r=e.target.dataset.tracks,l=n.map((function(e){return[e.playlistId,e.percentage,e.playlistName]}));t(l),a(r),window.scrollTo({top:0,left:0,behavior:"smooth"})},l=function(e){var t=e.target.id.replace("playlist-","");fetch("/deletePlaylist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({idToDelete:t})}).then((function(e){200===e.status?window.location.reload():alert("Something went wrong. Server status: ".concat(e.status))})).catch((function(e){alert("Something went wrong. ".concat(JSON.stringify(e)))}))};try{var i=e.playlists,c=e.compositions;return i.map((function(e){var t=e.id,a=+e.name.split("-")[2],i=new Date(a),o="https://www.porknachos.com/files/naviavi.jpg";e.images&&e.images.length>1&&(o=e.images[1].url);var s=c.filter((function(e){return e.timestamp===a.toString()}))[0],m="".concat(i.toLocaleTimeString(),", ").concat(i.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"short",day:"numeric"}));if(void 0!==s){var u=s.compositionData,p=s.numberOfTracks;return!p||p<1?r.a.createElement("li",{key:t,className:"playlist-entry-wrap"},r.a.createElement("a",{href:"/radio?timestamp=".concat(a,"&listId=").concat(t)},r.a.createElement("img",{src:o,alt:"playlist graphic from spotify"}),r.a.createElement("p",null,"An empty playlist")),r.a.createElement("div",{className:"playlist-buttons"},r.a.createElement("div",null,"\xa0"),r.a.createElement("button",{onClick:l,className:"delete-playlist-btn",id:"playlist-".concat(t)},"delete this playlist")),"`"):r.a.createElement("li",{key:t,className:"playlist-entry-wrap"},r.a.createElement("a",{href:"/radio?timestamp=".concat(a,"&listId=").concat(t)},r.a.createElement("img",{src:o,alt:"playlist graphic from spotify"}),r.a.createElement("p",null,m," - ",p," songs")),u.map((function(e){return r.a.createElement("p",{key:e.playlistId,className:"one-playlist-line"},e.playlistName," (",e.playlistId,")",r.a.createElement("span",null,e.percentage,"%"))})),r.a.createElement("div",{className:"playlist-buttons"},r.a.createElement("button",{className:"make-another-btn","data-composition":JSON.stringify(u),"data-tracks":p,onClick:n},"Set up a similar playlist"),r.a.createElement("button",{onClick:l,className:"delete-playlist-btn",id:"playlist-".concat(t)},"delete this playlist")),"`")}return r.a.createElement("li",{className:"playlist-entry-wrap"},r.a.createElement("a",{href:"/radio?timestamp=".concat(a,"&listId=").concat(t)},r.a.createElement("img",{src:"".concat(e.images[1].url),alt:"playlist graphic from spotify"}),r.a.createElement("p",null,"$",m)))}))}catch(o){return console.log(o,"error mapping playlists"),r.a.createElement("a",{href:"/"},"Something failed catastrophically. Try logging in again.")}}(y,u,l)))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));i.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(s,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))},7:function(e,t,a){e.exports=a(13)}},[[7,1,2]]]);
//# sourceMappingURL=main.309e59b8.chunk.js.map