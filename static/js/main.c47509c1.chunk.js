(this["webpackJsonpdevelopers-portfolio"]=this["webpackJsonpdevelopers-portfolio"]||[]).push([[0],{1:function(e){e.exports=JSON.parse('{"a":"Mark","c":"Anthony","b":"Rathbone","f":"| Bash | Python | Linux | Networking | Security | Cloud ","j":[{"id":0,"image":"fa-github","url":"https://github.com/MarkRathbone","style":"socialicons"},{"id":1,"image":"fa-linkedin","url":"https://www.linkedin.com/in/markanthonyrathbone/","style":"socialicons"},{"id":2,"image":"fa-twitter","url":"https://www.twitter.com/markarathbone/","style":"socialicons"}],"e":"About Me","q":true,"k":"https://www.instagram.com/","m":"markanthonyrathbone","l":"/?__a=1","d":"I am a AWS and Microsoft Certified Cloud Practitioner graduate from the AWS/reStart program in Birmingham, UK, by Generation UK&I. I have 10 years of experience working with hardware and I\'m now looking for Junior-level work in Cloud. I\'m currently very interested in continuing to develop my IAC and Cloud Analytics skills and starting to study about AI and Machine Learning.","n":"Recent Projects","g":"https://api.github.com/users/","i":"MarkRathbone","h":"/repos?sort=updated&direction=desc","o":6,"r":true,"p":true}')},14:function(e,a,t){e.exports=t.p+"static/media/resume.eb7b5d10.pdf"},36:function(e,a,t){e.exports=t(67)},41:function(e,a,t){},45:function(e,a,t){},67:function(e,a,t){"use strict";t.r(a);var n=t(0),r=t.n(n),o=t(30),l=t.n(o),i=(t(41),t(11)),c=t(8),s=(t(42),t(43),t(45),t(1)),m=t(35),d=t(3),u=t(31),h=t.n(u),g=function(){var e=Object(n.useState)(new Array(s.j.length).fill("socialicons")),a=Object(d.a)(e,2),t=a[0],o=a[1],l=function(e){var a=Object(m.a)(t);return"enter"===e.event?(a[e.icon.id]="socialiconshover",o(a)):"leave"===e.event?(a[e.icon.id]="socialicons",o(a)):void 0};return r.a.createElement("div",null,r.a.createElement("div",{id:"home",className:"title jumbotron jumbotron-fluid bg-transparent bgstyle text-light min-vh-100 d-flex align-content-center align-items-center flex-wrap m-0"},r.a.createElement("div",{id:"stars"}),r.a.createElement("div",{className:"container container-fluid text-center "},r.a.createElement("h1",{className:"display-1"},s.a+" "+s.c+" "+s.b),r.a.createElement(h.a,{className:"lead"}," ",s.f),r.a.createElement("div",{className:"p-5"},s.j.map((function(e){return r.a.createElement("a",{key:e.id,target:"_blank",rel:"noopener noreferrer",href:e.url,"aria-label":"My ".concat(e.image.split("-")[1])},r.a.createElement("i",{className:"fab ".concat(e.image,"  fa-3x ").concat(t[e.id]),onMouseOver:function(){return l({icon:e,event:"enter"})},onMouseOut:function(){return l({icon:e,event:"leave"})}}))}))),r.a.createElement("a",{className:"btn btn-outline-light btn-lg",href:"#aboutme",role:"button","aria-label":"Learn more about me"},"More about me"))))},b=t(10),f=t.n(b),p=t(14),v=t.n(p),w=function(){var e=Object(n.useState)(""),a=Object(d.a)(e,2),t=a[0],o=a[1],l=Object(n.useState)(s.q),i=Object(d.a)(l,2),c=i[0],m=i[1],u=Object(n.useState)(v.a),h=Object(d.a)(u,1)[0];Object(n.useEffect)((function(){c&&g()}),[c]);var g=function(e){f.a.get(s.k+s.m+s.l).then((function(e){return o(e.data.graphql.user.profile_pic_url_hd)})).catch((function(e){return m(!1),console.error(e.message)})).finally((function(){}))};return r.a.createElement("div",{id:"aboutme",className:"jumbotron jumbotron-fluid m-0"},r.a.createElement("div",{className:"container container-fluid p-5"},r.a.createElement("div",{className:"row"},c&&r.a.createElement("div",{className:"col-5 d-none d-lg-block align-self-center"},r.a.createElement("img",{className:"border border-secondary rounded-circle",src:t,alt:"profilepicture"})),r.a.createElement("div",{className:"col-lg-".concat(c?"7":"12")},r.a.createElement("h1",{className:"display-4 mb-5 text-center"},s.e),r.a.createElement("p",{className:"lead text-center"},s.d),h&&r.a.createElement("p",{className:"lead text-center"},r.a.createElement("a",{className:"btn btn-outline-dark btn-lg",href:v.a,target:"_blank",rel:"noreferrer noopener",role:"button","aria-label":"CV"},"CV"))))))},E=function(e){var a=e.value,t=Object(n.useState)([]),o=Object(d.a)(t,2),l=o[0],i=o[1],c=Object(n.useCallback)((function(e){f.a.get(a).then((function(e){return i(e.data)})).catch((function(e){return console.error(e.message)})).finally((function(){}))}),[a]);Object(n.useEffect)((function(){c()}),[c]);var s=[],m=0;for(var u in l)s.push(u),m+=l[u];return r.a.createElement("div",{className:"pb-3"},"Languages:"," ",s.map((function(e){return r.a.createElement("p",{key:e,className:"badge badge-light card-link"},e,": ",Math.trunc(l[e]/m*1e3)/10," %")})))},N=function(e){var a=e.value,t=Object(n.useState)("0 mints"),o=Object(d.a)(t,2),l=o[0],i=o[1],c=Object(n.useCallback)((function(e){var t=new Date(a.pushed_at),n=(new Date).getTime()-t.getTime(),r=Math.trunc(n/1e3/60/60);if(r<24)return i("".concat(r.toString()," hours ago"));var o=t.getDate(),l=t.getMonth(),c=t.getFullYear();return i("on ".concat(o," ").concat(["January","February","March","April","May","June","July","August","September","October","November","December"][l]," ").concat(c))}),[a.pushed_at]);Object(n.useEffect)((function(){c()}),[c]);var s=a.name,m=a.description,u=a.svn_url,h=a.stargazers_count,g=a.languages_url;return r.a.createElement("div",{className:"col-md-6"},r.a.createElement("div",{className:"card shadow-lg p-3 mb-5 bg-white rounded"},r.a.createElement("div",{className:"card-body"},r.a.createElement("h5",{className:"card-title"},s," "),r.a.createElement("p",{className:"card-text"},m," "),r.a.createElement("a",{href:"".concat(u,"/archive/master.zip"),className:"btn btn-outline-secondary mr-3"},r.a.createElement("i",{className:"fab fa-github"})," Clone Project"),r.a.createElement("a",{href:u,target:" _blank",className:"btn btn-outline-secondary"},r.a.createElement("i",{className:"fab fa-github"})," Repo"),r.a.createElement("hr",null),r.a.createElement(E,{value:g}),r.a.createElement("p",{className:"card-text"},r.a.createElement("span",{className:"text-dark card-link mr-4"},r.a.createElement("i",{className:"fab fa-github"})," Stars"," ",r.a.createElement("span",{className:"badge badge-dark"},h)),r.a.createElement("small",{className:"text-muted"},"Updated ",l)))))},y=function(){var e=Object(n.useState)([]),a=Object(d.a)(e,2),t=a[0],o=a[1],l=Object(n.useCallback)((function(e){f.a.get(s.g+s.i+s.h).then((function(e){return o(e.data.slice(0,s.o))})).catch((function(e){return console.error(e.message)})).finally((function(){}))}),[]);return Object(n.useEffect)((function(){l()}),[l]),r.a.createElement("div",{id:"projects",className:"jumbotron jumbotron-fluid bg-transparent m-0"},t.length&&r.a.createElement("div",{className:"container container-fluid p-5"},r.a.createElement("h1",{className:"display-4 pb-5"},s.n),r.a.createElement("div",{className:"row"},t.map((function(e){return r.a.createElement(N,{key:e.id,id:e.id,value:e})})))))},k=function(){var e=Object(n.useState)({backgroundColor:"#f5f5f5"}),a=Object(d.a)(e,1)[0];return r.a.createElement("footer",{style:a,className:"mt-auto py-3 text-center"},r.a.createElement("i",{className:"fas fa-code"})," with ",r.a.createElement("i",{className:"fas fa-heart"})," by"," ",r.a.createElement("a",{className:"badge badge-dark",rel:"noopener",href:"https://github.com/hashirshoaeb","aria-label":"My GitHub"},"Hashir Shoaib")," ","using ",r.a.createElement("i",{className:"fab fa-react"}),r.a.createElement("p",null,r.a.createElement("small",{className:"text-muted"}," ","Project code is open source. Feel free to fork and make your own version.")))},j=function(e){var a=Object(n.useState)(!0),t=Object(d.a)(a,2),o=t[0],l=t[1];return Object(n.useEffect)((function(){document.addEventListener("scroll",(function(){var e=window.scrollY<200;e!==o&&l(e)}))}),[o]),r.a.createElement("nav",{className:"navbar navbar-expand-lg fixed-top navbar-light ".concat(o?"bg-transparent":"bg-gradient"," ")},r.a.createElement("a",{className:"navbar-brand",href:"/#home"},"<".concat(s.a," />")),r.a.createElement("button",{className:"navbar-toggler",type:"button","data-toggle":"collapse","data-target":"#navbarTogglerDemo02","aria-controls":"navbarTogglerDemo02","aria-expanded":"false","aria-label":"Toggle navigation"},r.a.createElement("span",{className:"navbar-toggler-icon"})),r.a.createElement("div",{className:"collapse navbar-collapse",id:"navbarTogglerDemo02"},r.a.createElement("ul",{className:"navbar-nav mr-auto mt-2 mt-lg-0"},s.p&&r.a.createElement("li",{className:"nav-item"},r.a.createElement(i.b,{className:"nav-link lead",to:"/blog"},"Blog")),r.a.createElement("li",{className:"nav-item"},r.a.createElement("a",{className:"nav-link lead",href:"/#projects"},"Projects")),r.a.createElement("li",{className:"nav-item"},r.a.createElement("a",{className:"nav-link lead",href:v.a,target:"_blank",rel:"noreferrer noopener"},r.a.createElement("b",null,"CV"))),r.a.createElement("li",{className:"nav-item"},r.a.createElement("a",{className:"nav-link lead",href:"/#aboutme"},r.a.createElement("b",null,"About"))))))},I=t(34),x=[],O=new function e(a){var t=this,o=a.title,l=a.image,i=a.description;Object(I.a)(this,e),this.list=[],this.addParagraph=function(e){return t.list.push(r.a.createElement("p",{key:t.list.length,className:"lead"},e)),t},this.addHeading=function(e){return t.list.push(r.a.createElement(n.Fragment,{key:t.list.length},r.a.createElement("h1",{className:""},e),r.a.createElement("hr",null))),t},this.getBlog=function(){return r.a.createElement("div",{className:"container-lg"},t.list)},this.title=o,this.image=l,this.description=i}({title:"How I learned Terraform",image:"https://i.imgur.com/wl663oz.png",description:"This is a quick blog post explaining how I managed to teach myself Terraform!"}).addHeading("Why?").addParagraph("During AWS re/Start there were somethings we didn't have the time to cover, and although they're very important in reality, they aren't AWS Services so they aren't covered all too much, other than in 'You should know this exists' sense, and James also emphasised the importance of them. Having looked at a few job openings I had also saw a few things popping up over and over again: Terraform and Ansible being two of those.").addHeading("Starting Point").addParagraph("My starting point was simple: Go to the websites. These both had some very nice websites that quite concisely tell you what the tools do but I wanted more, so I went to YouTube. IBM cloud has a number of strong and well presented videos on AWS that I would highly recommend. There were a couple of things I wanted to know coming out of this: why they exist, what they do, and actual use case scenarios.").addHeading("Hashicorp Configuration Language").addParagraph("Just like with every other language there was a coding language to learn called HCL (Hashicorp Configuration Language) - which I honestly didn't find too bad. Once again I sat on YouTube and followed along with a video showing how to set up an AWS Infrastructure with a basic web server through Terraform. It was useful - after troubleshooting my mistakes and getting it working, I had a new project I wanted to do. Earlier in the course, when we had first been learning about AWS, I took the time to setup a small Terraria world server in AWS, nothing major or fancy - but something practical and useful for me in the future. I wanted to try setting up that same infrastructure in Terraform now.\n Now that I had the skills to use HCL at a basic level, there were some more things I wanted to find solutions to that weren't covered in the video I watched:\n The video had hard-coded AWS Credentials, which is a major security concern for anything that might be uploaded in the future, it had not used variables whatsoever, and Userdata wouldn't be enough for what I wanted to do, I would also have to learn Ansible and how to deploy it through Terraform.").addHeading("Initial Setup").addParagraph("Initially I simply did something very similar to what was used in the video I watched, not using variables or not configuring user data for now and using the Terraform documentation for any AWS Infrastructure that I needed to provision that wasn't covered in the video. I also went through the process in the AWS Console and noted down the steps there and made sure I had it all down in the .tf files before I continued. I then did a Terraform plan run to see if it was all correct, and... Nope. Ofcourse not, but a few typos, and a little bit of problem solving later it was solved. The server of the type I wanted was now being created by Terraform. But before I moved on I wanted to fix issues mentioned earlier. The first was to change the credentials to not be hard-coded, and this was again fixed by using Google to find resources I needed to know to make it use .aws/credentials instead of being coded into the file. Next-up was changing parts of the script to use variables.");x.push(O);var S=x,T=function(e){return r.a.createElement("div",{className:"container-lg mt-5 bg-blue"},r.a.createElement("h1",{className:"text-center"},"Blogs"),S.map((function(e,a){return r.a.createElement(A,{key:a,title:e.title,description:e.description,index:a})})))},A=function(e){var a=e.index,t=e.title,n=(e.image,e.description);return r.a.createElement("div",{className:"m-5"},r.a.createElement("div",{className:""},r.a.createElement("div",{className:"row"},r.a.createElement("div",{className:"col-4 col-lg-12"}),r.a.createElement("div",{className:"col-8 col-lg-12"},r.a.createElement("div",{className:""},r.a.createElement("h1",{className:""},t),r.a.createElement("p",{className:"lead"},n),r.a.createElement(i.b,{to:"".concat("","blog/").concat(a)},"Read more..."," ")))),r.a.createElement("hr",null)))},C=function(e){var a=e.match.params.id,t=S[a];return r.a.createElement("div",{className:"container-lg mt-5"},t&&r.a.createElement("div",null,r.a.createElement("h1",{className:"display-2 text-center"},t.title),r.a.createElement("img",{className:"img-fluid mb-2",src:t.image,alt:t.title}),t.getBlog()),!t&&r.a.createElement("h1",{className:"display-1 text-center"},"404 - Page not found"))},M=function(){return r.a.createElement(n.Fragment,null,r.a.createElement(g,null),r.a.createElement(w,null),r.a.createElement(y,null))},W=function(){return r.a.createElement(i.a,{basename:"/"},s.r&&r.a.createElement(j,null),r.a.createElement(c.a,{path:"/",exact:!0,component:M}),s.p&&r.a.createElement(c.a,{path:"/blog",exact:!0,component:T}),s.p&&r.a.createElement(c.a,{path:"/blog/:id",component:C}),r.a.createElement(k,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));l.a.render(r.a.createElement(W,null),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[36,1,2]]]);
//# sourceMappingURL=main.c47509c1.chunk.js.map