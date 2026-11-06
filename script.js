
const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];

document.addEventListener("DOMContentLoaded",()=>{
  const nav=$(".navbar"), menu=$(".menu-btn"), links=$(".nav-links"), top=$(".top-btn"), progress=$(".progress");
  if(menu) menu.addEventListener("click",()=>links.classList.toggle("open"));
  $$(".nav-links a").forEach(a=>a.addEventListener("click",()=>links.classList.remove("open")));
  const path=location.pathname.split("/").pop()||"index.html";
  $$(".nav-links a").forEach(a=>{if(a.getAttribute("href")===path)a.classList.add("active")});
  const themeBtn=$(".theme-btn"), saved=localStorage.getItem("irfan-theme");
  if(saved) document.documentElement.dataset.theme=saved;
  if(themeBtn) themeBtn.addEventListener("click",()=>{
    const next=document.documentElement.dataset.theme==="light"?"dark":"light";
    if(next==="dark") delete document.documentElement.dataset.theme; else document.documentElement.dataset.theme=next;
    localStorage.setItem("irfan-theme",next);
  });
  function scrollUI(){
    nav?.classList.toggle("scrolled",scrollY>30);
    top?.classList.toggle("show",scrollY>500);
    if(progress) progress.style.width=(scrollY/(document.documentElement.scrollHeight-innerHeight)*100)+"%";
  }
  addEventListener("scroll",scrollUI); scrollUI();
  top?.addEventListener("click",()=>scrollTo({top:0,behavior:"smooth"}));

  const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
  $$(".reveal").forEach(e=>obs.observe(e));

  // Hero slider
  const slides=$$(".hero-slide");
  if(slides.length){let i=0;setInterval(()=>{slides[i].classList.remove("active");i=(i+1)%slides.length;slides[i].classList.add("active")},5000)}

  // Animated counters
  $$(".counter").forEach(el=>obs.observe(el));
  const counterObs=new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting||e.target.dataset.done)return;
    e.target.dataset.done="1"; const target=+e.target.dataset.target; let n=0; const step=Math.max(1,Math.ceil(target/55));
    const tick=()=>{n=Math.min(target,n+step);e.target.textContent=n+(target>=100?"+":"");if(n<target)requestAnimationFrame(tick)};tick();
  }),{threshold:.7});
  $$(".counter").forEach(e=>counterObs.observe(e));

  // Gallery lightbox
  const modal=$(".modal"), modalImg=$(".modal img"), items=$$(".gallery-item");
  if(modal&&items.length){
    let gi=0;
    const open=i=>{gi=i;modalImg.src=items[gi].querySelector("img").src;modal.classList.add("open")};
    items.forEach((it,i)=>it.addEventListener("click",()=>open(i)));
    $(".close",modal)?.addEventListener("click",()=>modal.classList.remove("open"));
    $(".prev",modal)?.addEventListener("click",()=>open((gi-1+items.length)%items.length));
    $(".next",modal)?.addEventListener("click",()=>open((gi+1)%items.length));
    modal.addEventListener("click",e=>{if(e.target===modal)modal.classList.remove("open")});
    document.addEventListener("keydown",e=>{if(!modal.classList.contains("open"))return;if(e.key==="Escape")modal.classList.remove("open");if(e.key==="ArrowLeft")open((gi-1+items.length)%items.length);if(e.key==="ArrowRight")open((gi+1)%items.length)});
  }

  // Testimonials
  const reviews=[
    ["Ayaan Khan","The trainers actually track my progress instead of giving me a generic routine. Six months in and I feel stronger than ever."],
    ["Meera Reddy","The atmosphere is energetic without being intimidating. I finally enjoy going to the gym consistently."],
    ["Rahul Varma","The strength program and personal coaching made a huge difference to my technique and confidence."],
    ["Sana Ali","Clean equipment, friendly trainers and great variety. IRFAN GYM feels like a real fitness community."]
  ];
  let ri=0;
  const quote=$(".quote"), author=$(".quote-author"), dots=$(".dots");
  if(quote){
    reviews.forEach((_,i)=>{const d=document.createElement("button");d.className="dot"+(i===0?" active":"");d.addEventListener("click",()=>showReview(i));dots.appendChild(d)});
    function showReview(i){ri=i;quote.textContent='“'+reviews[i][1]+'”';author.textContent="— "+reviews[i][0];$$(".dot",dots).forEach((d,j)=>d.classList.toggle("active",j===i))}
    showReview(0);setInterval(()=>showReview((ri+1)%reviews.length),5000);
  }

  // BMI
  const bmiForm=$("#bmi-form");
  bmiForm?.addEventListener("submit",e=>{
    e.preventDefault(); const h=+$("#height").value/100,w=+$("#weight").value;
    const r=$("#bmi-result"); if(!h||!w||h<=0||w<=0){r.textContent="Please enter valid height and weight.";r.classList.add("show");return}
    const bmi=w/(h*h);let cat=bmi<18.5?"Underweight":bmi<25?"Normal":bmi<30?"Overweight":"Obese";
    r.innerHTML=`<strong>Your BMI: ${bmi.toFixed(1)}</strong><br>${cat}. BMI is a screening measure, not a medical diagnosis.`;r.classList.add("show");
  });

  // Workout generator
  const workouts=[
    ["CHEST + TRICEPS","Bench Press — 4 × 10","Incline Dumbbell Press — 3 × 12","Cable Fly — 3 × 15"],
    ["BACK + BICEPS","Lat Pulldown — 4 × 10","Seated Row — 3 × 12","Dumbbell Curl — 3 × 12"],
    ["LEG POWER","Squat — 4 × 8","Romanian Deadlift — 3 × 10","Walking Lunges — 3 × 12"],
    ["FULL BODY","Goblet Squat — 3 × 12","Push-ups — 3 × 12","Mountain Climbers — 3 × 30 sec"]
  ];
  $("#workout-btn")?.addEventListener("click",()=>{
    const w=workouts[Math.floor(Math.random()*workouts.length)];
    $("#workout-result").innerHTML=`<strong>${w[0]}</strong><br>${w.slice(1).join("<br>")}`;$("#workout-result").classList.add("show");
  });
  const quotes=["Discipline turns goals into results.","Small progress is still progress.","Train your body. Strengthen your mindset.","Consistency beats intensity when intensity is occasional.","Your future self will thank you for today's effort."];
  $("#quote-btn")?.addEventListener("click",()=>{$("#quote-result").textContent=quotes[Math.floor(Math.random()*quotes.length)];});

  // Contact form
  $("#contact-form")?.addEventListener("submit",e=>{
    e.preventDefault();const f=e.currentTarget,msg=$("#form-message");
    if(!f.checkValidity()){f.reportValidity();return}
    msg.textContent="Thanks! Your enquiry has been received. We’ll get back to you soon.";msg.classList.add("show");f.reset();
  });
});

/* PREMIUM INTERACTIONS */
document.addEventListener("DOMContentLoaded",()=>{
  $$(".faq-q").forEach(q=>q.addEventListener("click",()=>q.closest(".faq-item").classList.toggle("open")));
  const toast=$("#toast"), notify=t=>{if(!toast)return;toast.textContent=t;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2500)};
  $$(".demo-action").forEach(b=>b.addEventListener("click",()=>notify(b.dataset.message||"Demo feature activated.")));
  $("#newsletter-form")?.addEventListener("submit",e=>{e.preventDefault();if(!e.currentTarget.checkValidity()){e.currentTarget.reportValidity();return}e.currentTarget.reset();notify("You're on the IRFAN GYM updates list.")});
  $("#class-book-form")?.addEventListener("submit",e=>{e.preventDefault();if(!e.currentTarget.checkValidity()){e.currentTarget.reportValidity();return}e.currentTarget.reset();notify("Class request received. We'll confirm your spot.")});
  let streak=+localStorage.getItem("irfan-streak")||3;const ring=$("#streak-ring"),val=$("#streak-value");
  function draw(){if(val)val.textContent=streak+" DAYS";if(ring){let p=Math.min(streak/30*100,100);ring.style.background=`conic-gradient(var(--accent) 0 ${p}%,var(--surface2) ${p}% 100%)`}}draw();
  $("#streak-btn")?.addEventListener("click",()=>{streak=Math.min(streak+1,30);localStorage.setItem("irfan-streak",streak);draw();notify("Workout streak updated to "+streak+" days.")});
});
