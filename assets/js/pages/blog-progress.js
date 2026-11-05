// scroll progress bar at the top of the blog page
(function(){var b=document.querySelector('.bl-progress');if(!b)return;
function u(){var h=document.documentElement.scrollHeight-innerHeight;b.style.transform='scaleX('+(h>0?scrollY/h:0)+')';}
addEventListener('scroll',u,{passive:true});u();})();
