import { useState } from "react";

const TABS = [
  { id: "Dashboard", icon: "⚡" },
  { id: "Weight", icon: "⚖️" },
  { id: "Workout", icon: "💪" },
  { id: "Calories", icon: "🔥" },
  { id: "Calculator", icon: "🧮" }
];

const MUSCLES = ["Chest","Back","Shoulders","Biceps","Triceps","Legs","Core","Cardio"];
const EXERCISES = {
  Chest: ["Bench Press","Incline Bench Press","Decline Bench Press","Dumbbell Flyes","Cable Crossover","Push-Ups","Chest Dips"],
  Back: ["Deadlift","Pull-Ups","Barbell Row","Seated Cable Row","Lat Pulldown","T-Bar Row","Single-Arm Dumbbell Row"],
  Shoulders: ["Overhead Press","Dumbbell Lateral Raise","Front Raise","Arnold Press","Face Pull","Upright Row","Shrugs"],
  Biceps: ["Barbell Curl","Dumbbell Curl","Hammer Curl","Preacher Curl","Concentration Curl","Cable Curl","Incline Dumbbell Curl"],
  Triceps: ["Tricep Pushdown","Skull Crushers","Close-Grip Bench Press","Overhead Tricep Extension","Dips","Kickbacks","Diamond Push-Ups"],
  Legs: ["Squat","Leg Press","Romanian Deadlift","Leg Extension","Leg Curl","Calf Raises","Lunges","Hack Squat"],
  Core: ["Plank","Crunches","Leg Raises","Russian Twist","Ab Wheel","Cable Crunch","Hanging Knee Raise"],
  Cardio: ["Treadmill","Cycling","Rowing Machine","Jump Rope","Stair Climber","Elliptical","HIIT"]
};

const FOOD_DB = [
  {name:"Egg (whole)",cal:78,protein:6,carbs:1,fat:5,cat:"Proteins"},
  {name:"Egg white",cal:17,protein:4,carbs:0,fat:0,cat:"Proteins"},
  {name:"Chicken breast (100g)",cal:165,protein:31,carbs:0,fat:4,cat:"Proteins"},
  {name:"Chicken thigh (100g)",cal:209,protein:26,carbs:0,fat:11,cat:"Proteins"},
  {name:"Tuna (100g, canned)",cal:116,protein:26,carbs:0,fat:1,cat:"Proteins"},
  {name:"Salmon (100g)",cal:208,protein:20,carbs:0,fat:13,cat:"Proteins"},
  {name:"Ground beef 80% (100g)",cal:254,protein:17,carbs:0,fat:20,cat:"Proteins"},
  {name:"Whey protein shake (1 scoop)",cal:120,protein:25,carbs:3,fat:2,cat:"Proteins"},
  {name:"White rice (100g cooked)",cal:130,protein:3,carbs:28,fat:0,cat:"Carbs"},
  {name:"Brown rice (100g cooked)",cal:123,protein:3,carbs:26,fat:1,cat:"Carbs"},
  {name:"Oats (100g)",cal:389,protein:17,carbs:66,fat:7,cat:"Carbs"},
  {name:"Bread (1 slice)",cal:79,protein:3,carbs:15,fat:1,cat:"Carbs"},
  {name:"Sweet potato (100g)",cal:86,protein:2,carbs:20,fat:0,cat:"Carbs"},
  {name:"Pasta (100g cooked)",cal:131,protein:5,carbs:25,fat:1,cat:"Carbs"},
  {name:"Whole milk (250ml)",cal:149,protein:8,carbs:12,fat:8,cat:"Dairy"},
  {name:"Greek yogurt (150g)",cal:130,protein:15,carbs:8,fat:4,cat:"Dairy"},
  {name:"Cottage cheese (100g)",cal:98,protein:11,carbs:3,fat:4,cat:"Dairy"},
  {name:"Banana (medium)",cal:105,protein:1,carbs:27,fat:0,cat:"Fruits"},
  {name:"Apple (medium)",cal:95,protein:0,carbs:25,fat:0,cat:"Fruits"},
  {name:"Orange (medium)",cal:62,protein:1,carbs:15,fat:0,cat:"Fruits"},
  {name:"Peanut butter (2 tbsp)",cal:188,protein:8,carbs:6,fat:16,cat:"Fats"},
  {name:"Almond (28g)",cal:164,protein:6,carbs:6,fat:14,cat:"Fats"},
  {name:"Olive oil (1 tbsp)",cal:119,protein:0,carbs:0,fat:14,cat:"Fats"},
  {name:"Broccoli (100g)",cal:34,protein:3,carbs:7,fat:0,cat:"Veggies"},
  {name:"Spinach (100g)",cal:23,protein:3,carbs:4,fat:0,cat:"Veggies"},
  {name:"Protein bar (avg)",cal:200,protein:20,carbs:22,fat:7,cat:"Proteins"},
  {name:"Orange juice (250ml)",cal:112,protein:2,carbs:26,fat:0,cat:"Drinks"},
  {name:"Coffee (black)",cal:5,protein:0,carbs:1,fat:0,cat:"Drinks"},
];

const FOOD_CATS = ["All","Proteins","Carbs","Dairy","Fruits","Fats","Veggies","Drinks"];
const MUSCLE_ICONS = {Chest:"🫁",Back:"🔙",Shoulders:"🏔️",Biceps:"💪",Triceps:"🦾",Legs:"🦵",Core:"🎯",Cardio:"🏃"};

function useStore(key, init) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : init; } catch { return init; }
  });
  const setter = v => {
    const next = typeof v === "function" ? v(val) : v;
    setVal(next);
    try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
  };
  return [val, setter];
}

const today = () => new Date().toISOString().slice(0,10);
const fmt = d => new Date(d+"T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"});
const fmtW = w => w ? w.toFixed(1) : "—";

function MiniChart({data, color="#6C63FF", th}) {
  if (!data||data.length<2) return (
    <div style={{textAlign:"center",padding:"24px 0",color:th.sub,fontSize:13}}>Log more entries to see your trend 📈</div>
  );
  const W=300,H=90,pad=12;
  const vals=data.map(d=>d.value);
  const min=Math.min(...vals),max=Math.max(...vals),range=max-min||1;
  const pts=data.map((d,i)=>{
    const x=pad+(i/(data.length-1))*(W-pad*2);
    const y=H-pad-((d.value-min)/range)*(H-pad*2);
    return `${x},${y}`;
  });
  const area=pts.join(" ")+` ${W-pad},${H} ${pad},${H}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{width:"100%",height:H}}>
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={color} stopOpacity="0.2"/>
        <stop offset="100%" stopColor={color} stopOpacity="0"/>
      </linearGradient></defs>
      <polygon points={area} fill="url(#cg)"/>
      <polyline points={pts.join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {pts.map((p,i)=>{ const [x,y]=p.split(",").map(Number); return <circle key={i} cx={x} cy={y} r="3.5" fill={color}/>; })}
    </svg>
  );
}

function StatCard({label,value,sub,color,icon,th}) {
  return (
    <div style={{background:th.surface,borderRadius:12,padding:"14px 16px"}}>
      {icon&&<div style={{fontSize:22,marginBottom:4}}>{icon}</div>}
      <div style={{fontSize:12,color:th.sub,marginBottom:4}}>{label}</div>
      <div style={{fontSize:22,fontWeight:500,color:color||th.text}}>{value}</div>
      {sub&&<div style={{fontSize:11,color:th.sub,marginTop:3}}>{sub}</div>}
    </div>
  );
}

function SectionCard({children,th,style={}}) {
  return (
    <div style={{background:th.card,border:`0.5px solid ${th.border}`,borderRadius:12,padding:18,marginBottom:14,...style}}>
      {children}
    </div>
  );
}

function Label({children,th}) {
  return <div style={{fontSize:12,color:th.sub,marginBottom:5,fontWeight:500}}>{children}</div>;
}

function MacroPill({label,value,color,th}) {
  return (
    <div style={{flex:1,background:th.bg,border:`0.5px solid ${th.border}`,borderRadius:10,padding:"8px 4px",textAlign:"center"}}>
      <div style={{fontSize:10,color:th.sub,marginBottom:2}}>{label}</div>
      <div style={{fontSize:15,fontWeight:500,color}}>{value}</div>
    </div>
  );
}

function CalcTab({th}) {
  const [age,setAge]=useState(""); const [gender,setGender]=useState("male");
  const [weight,setWeight]=useState(""); const [height,setHeight]=useState("");
  const [activity,setActivity]=useState("moderate"); const [goal,setGoal]=useState("maintain");
  const [result,setResult]=useState(null);
  const actMult={sedentary:{label:"🛋️ Sedentary",val:1.2},light:{label:"🚶 Light (1–3 days/week)",val:1.375},moderate:{label:"🏃 Moderate (3–5 days/week)",val:1.55},active:{label:"💪 Active (6–7 days/week)",val:1.725},veryactive:{label:"🔥 Very Active (2x/day)",val:1.9}};
  const goals={lose2:{label:"🏹 Lose weight fast (−0.5 kg/week)",delta:-1000},lose1:{label:"📉 Lose weight (−0.25 kg/week)",delta:-500},maintain:{label:"⚖️ Maintain weight",delta:0},gain1:{label:"📈 Gain muscle (slow bulk)",delta:300},gain2:{label:"🚀 Gain muscle fast (bulk)",delta:500}};
  function calculate() {
    if (!age||!weight||!height) return;
    const w=parseFloat(weight),h=parseFloat(height),a=parseInt(age);
    const bmr=gender==="male"?10*w+6.25*h-5*a+5:10*w+6.25*h-5*a-161;
    const tdee=Math.round(bmr*actMult[activity].val);
    const target=Math.round(tdee+goals[goal].delta);
    const protein=Math.round(w*2.0),fat=Math.round(target*0.25/9),carbs=Math.round((target-protein*4-fat*9)/4);
    setResult({bmr:Math.round(bmr),tdee,target,protein,fat,carbs});
  }
  const iS={width:"100%",boxSizing:"border-box",background:th.surface,color:th.text,border:`0.5px solid ${th.border}`,borderRadius:8,padding:"8px 10px",fontSize:14};
  return (
    <div>
      <SectionCard th={th}>
        <div style={{fontSize:15,fontWeight:500,marginBottom:4,color:th.text}}>🧮 Calorie Calculator</div>
        <div style={{fontSize:12,color:th.sub,marginBottom:16}}>Based on the Mifflin-St Jeor formula</div>
        <Label th={th}>Gender</Label>
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {["male","female"].map(g=>(
            <button key={g} onClick={()=>setGender(g)} style={{flex:1,padding:"9px",fontSize:13,borderRadius:10,cursor:"pointer",background:gender===g?"#6C63FF":th.surface,color:gender===g?"#fff":th.sub,border:`0.5px solid ${gender===g?"#6C63FF":th.border}`,fontWeight:gender===g?500:400}}>{g==="male"?"👨 Male":"👩 Female"}</button>
          ))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
          <div><Label th={th}>Age</Label><input type="number" placeholder="yrs" value={age} onChange={e=>setAge(e.target.value)} style={iS}/></div>
          <div><Label th={th}>Weight (kg)</Label><input type="number" placeholder="kg" value={weight} onChange={e=>setWeight(e.target.value)} style={iS}/></div>
          <div><Label th={th}>Height (cm)</Label><input type="number" placeholder="cm" value={height} onChange={e=>setHeight(e.target.value)} style={iS}/></div>
        </div>
        <Label th={th}>Activity level</Label>
        <select value={activity} onChange={e=>setActivity(e.target.value)} style={{...iS,marginBottom:14}}>
          {Object.entries(actMult).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
        </select>
        <Label th={th}>My goal</Label>
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:16}}>
          {Object.entries(goals).map(([k,v])=>(
            <button key={k} onClick={()=>setGoal(k)} style={{padding:"10px 14px",fontSize:13,borderRadius:10,cursor:"pointer",textAlign:"left",background:goal===k?"#6C63FF":th.surface,color:goal===k?"#fff":th.text,border:`0.5px solid ${goal===k?"#6C63FF":th.border}`,fontWeight:goal===k?500:400}}>{v.label}</button>
          ))}
        </div>
        <button onClick={calculate} style={{width:"100%",background:"#6C63FF",color:"#fff",border:"none",padding:"11px",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer"}}>Calculate my calories ✓</button>
      </SectionCard>
      {result&&(
        <>
          <SectionCard th={th}>
            <div style={{textAlign:"center",marginBottom:16}}>
              <div style={{fontSize:13,color:th.sub,marginBottom:4}}>Your daily calorie target</div>
              <div style={{fontSize:44,fontWeight:500,color:"#6C63FF"}}>{result.target}</div>
              <div style={{fontSize:13,color:th.sub}}>kcal / day</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div style={{background:th.surface,borderRadius:10,padding:"12px",textAlign:"center"}}><div style={{fontSize:11,color:th.sub,marginBottom:3}}>BMR</div><div style={{fontSize:18,fontWeight:500,color:th.text}}>{result.bmr} kcal</div></div>
              <div style={{background:th.surface,borderRadius:10,padding:"12px",textAlign:"center"}}><div style={{fontSize:11,color:th.sub,marginBottom:3}}>TDEE</div><div style={{fontSize:18,fontWeight:500,color:th.text}}>{result.tdee} kcal</div></div>
            </div>
            <div style={{fontSize:13,fontWeight:500,marginBottom:8,color:th.text}}>Recommended macros</div>
            <div style={{display:"flex",gap:8}}>
              <MacroPill label="Protein" value={`${result.protein}g`} color="#3266ad" th={th}/>
              <MacroPill label="Carbs" value={`${result.carbs}g`} color="#BA7517" th={th}/>
              <MacroPill label="Fat" value={`${result.fat}g`} color="#639922" th={th}/>
            </div>
          </SectionCard>
          <SectionCard th={th}>
            <div style={{fontSize:13,fontWeight:500,marginBottom:12,color:th.text}}>💡 Tips for your goal</div>
            {goal.startsWith("lose")&&["Eat in a calorie deficit — don't go below 1200 kcal (women) or 1500 kcal (men)","Keep protein high to preserve muscle while losing fat","Do strength training + cardio for best results","Aim for 0.5–1 kg loss per week","Drink plenty of water"].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",fontSize:13,color:th.text,marginBottom:6}}><span style={{color:"#1D9E75"}}>✓</span>{t}</div>
            ))}
            {goal==="maintain"&&["Eat close to your TDEE each day","Track your weight weekly","Balance your macros","Stay consistent with training","Adjust if weight drifts"].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",fontSize:13,color:th.text,marginBottom:6}}><span style={{color:"#3266ad"}}>✓</span>{t}</div>
            ))}
            {goal.startsWith("gain")&&["Eat in a small calorie surplus to minimise fat gain","Aim for 1.8–2.2g protein per kg of bodyweight","Progressive overload in the gym is key","Get 7–9 hours of sleep — muscle is built at rest","Track your lifts, not just your food"].map((t,i)=>(
              <div key={i} style={{display:"flex",gap:10,alignItems:"flex-start",fontSize:13,color:th.text,marginBottom:6}}><span style={{color:"#D85A30"}}>✓</span>{t}</div>
            ))}
          </SectionCard>
        </>
      )}
    </div>
  );
}

export default function App() {
  const [tab,setTab]=useState("Dashboard");
  const [theme,setTheme]=useState("light");
  const [weights,setWeights]=useStore("velo_weights",[]);
  const [workouts,setWorkouts]=useStore("velo_workouts",[]);
  const [calories,setCalories]=useStore("velo_calories",[]);
  const [wInput,setWInput]=useState(""); const [wDate,setWDate]=useState(today());
  const [exMuscle,setExMuscle]=useState("Chest"); const [exName,setExName]=useState("Bench Press");
  const [exSets,setExSets]=useState("3"); const [exReps,setExReps]=useState("10");
  const [exKg,setExKg]=useState(""); const [exDate,setExDate]=useState(today());
  const [foodCat,setFoodCat]=useState("All"); const [foodSearch,setFoodSearch]=useState("");
  const [selectedFood,setSelectedFood]=useState(null); const [foodQty,setFoodQty]=useState(1);
  const [cDate,setCDate]=useState(today());

  const themes={
    light:{bg:"#f7f7f7",surface:"#efefef",card:"#ffffff",text:"#111",sub:"#777",border:"#e0e0e0",label:"☀️ Light"},
    night:{bg:"#1a1a2e",surface:"#16213e",card:"#0f3460",text:"#e0e0ff",sub:"#9999cc",border:"#2a2a5a",label:"🌙 Night"},
    black:{bg:"#0a0a0a",surface:"#141414",card:"#1c1c1c",text:"#f0f0f0",sub:"#888",border:"#2a2a2a",label:"⬛ Black"},
  };
  const th=themes[theme];
  const greetingHour=new Date().getHours();
  const greeting=greetingHour<12?"Good morning":greetingHour<17?"Good afternoon":"Good evening";
  const latestW=weights.length?weights[weights.length-1].value:null;
  const firstW=weights.length?weights[0].value:null;
  const diffW=latestW&&firstW?latestW-firstW:null;
  const todayWorkouts=workouts.filter(w=>w.date===today());
  const totalSets=workouts.reduce((a,w)=>a+Number(w.sets),0);
  const todayCals=calories.filter(c=>c.date===today()).reduce((a,c)=>a+Number(c.cal),0);
  const avgCals=(()=>{if(!calories.length)return 0;const byDay=calories.reduce((acc,c)=>{acc[c.date]=(acc[c.date]||0)+Number(c.cal);return acc;},{});const days=Object.values(byDay);return Math.round(days.reduce((a,b)=>a+b,0)/days.length);})();
  const todayMacros=calories.filter(c=>c.date===today()).reduce((a,c)=>({protein:a.protein+(c.protein||0),carbs:a.carbs+(c.carbs||0),fat:a.fat+(c.fat||0)}),{protein:0,carbs:0,fat:0});

  function addWeight(){if(!wInput)return;const updated=[...weights.filter(w=>w.date!==wDate),{date:wDate,value:parseFloat(wInput)}].sort((a,b)=>a.date.localeCompare(b.date));setWeights(updated);setWInput("");}
  function handleMuscleChange(m){setExMuscle(m);setExName(EXERCISES[m][0]);}
  function addWorkout(){setWorkouts([...workouts,{date:exDate,name:exName,muscle:exMuscle,sets:exSets,reps:exReps,kg:exKg}]);setExKg("");}
  function addFood(){if(!selectedFood)return;setCalories([...calories,{date:cDate,food:`${selectedFood.name}${foodQty>1?" ×"+foodQty:""}`,cal:Math.round(selectedFood.cal*foodQty),protein:Math.round(selectedFood.protein*foodQty),carbs:Math.round(selectedFood.carbs*foodQty),fat:Math.round(selectedFood.fat*foodQty)}]);setSelectedFood(null);setFoodQty(1);setFoodSearch("");}
  const filteredFoods=FOOD_DB.filter(f=>foodCat==="All"||f.cat===foodCat).filter(f=>f.name.toLowerCase().includes(foodSearch.toLowerCase()));
  const iS={width:"100%",boxSizing:"border-box",background:th.surface,color:th.text,border:`0.5px solid ${th.border}`,borderRadius:8,padding:"8px 10px",fontSize:14};

  return (
    <div style={{fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif",maxWidth:680,margin:"0 auto",background:th.bg,minHeight:"100vh",color:th.text}}>
      <div style={{padding:"18px 16px 0"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{background:"linear-gradient(135deg,#6C63FF,#3266ad)",borderRadius:10,width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>⚡</div>
            <div>
              <div style={{fontSize:20,fontWeight:500,color:th.text}}>Velo</div>
              <div style={{fontSize:10,color:th.sub,letterSpacing:"0.5px",textTransform:"uppercase"}}>Track · Train · Transform</div>
            </div>
          </div>
          <div style={{display:"flex",gap:5}}>
            {Object.entries(themes).map(([key,t])=>(
              <button key={key} onClick={()=>setTheme(key)} style={{padding:"5px 9px",fontSize:11,borderRadius:20,cursor:"pointer",background:theme===key?"#6C63FF":"transparent",color:theme===key?"#fff":th.sub,border:`0.5px solid ${theme===key?"#6C63FF":th.border}`}}>{t.label}</button>
            ))}
          </div>
        </div>
        <div style={{fontSize:13,color:th.sub,marginBottom:14}}>{greeting} 👋 Ready to crush it today?</div>
        <div style={{display:"flex",gap:3,background:th.surface,borderRadius:12,padding:4}}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:tab===t.id?th.card:"transparent",border:tab===t.id?`0.5px solid ${th.border}`:"none",borderRadius:9,padding:"7px 2px",cursor:"pointer",fontSize:11,fontWeight:tab===t.id?500:400,color:tab===t.id?th.text:th.sub}}>
              <div style={{fontSize:15,marginBottom:1}}>{t.icon}</div>{t.id}
            </button>
          ))}
        </div>
      </div>

      <div style={{padding:"16px 16px 2rem"}}>
        {tab==="Dashboard"&&(
          <div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <StatCard th={th} icon="⚖️" label="Current weight" value={latestW?`${fmtW(latestW)} kg`:"—"} sub={diffW!==null?`${diffW>=0?"▲":"▼"} ${Math.abs(diffW).toFixed(1)} kg overall`:"Log your weight"} color={diffW<0?"#1D9E75":diffW>0?"#D85A30":undefined}/>
              <StatCard th={th} icon="🔥" label="Today's calories" value={todayCals||"—"} sub={todayCals?`kcal · avg ${avgCals}/day`:"Nothing logged yet"}/>
              <StatCard th={th} icon="💪" label="Exercises today" value={todayWorkouts.length||"—"} sub={todayWorkouts.length?todayWorkouts.map(w=>w.name).slice(0,2).join(", "):"Rest day"}/>
              <StatCard th={th} icon="📊" label="Total sets ever" value={totalSets||"—"} sub={`${workouts.length} exercise logs`}/>
            </div>
            {todayCals>0&&<SectionCard th={th}><div style={{fontSize:13,fontWeight:500,marginBottom:10,color:th.text}}>Today's macros</div><div style={{display:"flex",gap:8}}><MacroPill th={th} label="Protein" value={`${todayMacros.protein}g`} color="#3266ad"/><MacroPill th={th} label="Carbs" value={`${todayMacros.carbs}g`} color="#BA7517"/><MacroPill th={th} label="Fat" value={`${todayMacros.fat}g`} color="#639922"/></div></SectionCard>}
            <SectionCard th={th}><div style={{fontSize:13,fontWeight:500,color:th.text,marginBottom:2}}>Weight trend</div><div style={{fontSize:11,color:th.sub,marginBottom:8}}>Last {Math.min(weights.length,14)} entries</div><MiniChart data={weights.slice(-14)} color="#6C63FF" th={th}/></SectionCard>
            <SectionCard th={th}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:10,color:th.text}}>Recent workouts</div>
              {workouts.length===0&&<p style={{fontSize:13,color:th.sub,margin:0}}>No workouts yet — log your first one! 💪</p>}
              {workouts.slice(-4).reverse().map((w,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`0.5px solid ${th.border}`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:18}}>{MUSCLE_ICONS[w.muscle]||"💪"}</span><div><div style={{fontWeight:500,fontSize:14,color:th.text}}>{w.name}</div><div style={{fontSize:11,color:th.sub}}>{w.muscle} · {fmt(w.date)}</div></div></div>
                  <div style={{fontSize:13,color:th.sub,textAlign:"right"}}>{w.sets}×{w.reps}{w.kg&&<><br/><span style={{color:th.text,fontWeight:500}}>{w.kg} kg</span></>}</div>
                </div>
              ))}
            </SectionCard>
          </div>
        )}

        {tab==="Weight"&&(
          <div>
            <SectionCard th={th}>
              <div style={{fontSize:15,fontWeight:500,marginBottom:14,color:th.text}}>⚖️ Log your weight</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                <div><Label th={th}>Weight (kg)</Label><input type="number" placeholder="e.g. 82.5" value={wInput} onChange={e=>setWInput(e.target.value)} style={iS}/></div>
                <div><Label th={th}>Date</Label><input type="date" value={wDate} onChange={e=>setWDate(e.target.value)} style={iS}/></div>
              </div>
              <button onClick={addWeight} style={{width:"100%",background:"#6C63FF",color:"#fff",border:"none",padding:"10px",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer"}}>Save weight ✓</button>
            </SectionCard>
            {weights.length>=2&&<SectionCard th={th}><div style={{fontSize:13,fontWeight:500,color:th.text,marginBottom:2}}>Your progress</div><div style={{fontSize:11,color:th.sub,marginBottom:10}}>{firstW&&latestW&&<>Started at <b>{fmtW(firstW)} kg</b> · Now <b style={{color:diffW<=0?"#1D9E75":"#D85A30"}}>{fmtW(latestW)} kg</b></>}</div><MiniChart data={weights} color="#6C63FF" th={th}/></SectionCard>}
            <SectionCard th={th}>
              <div style={{fontSize:13,fontWeight:500,marginBottom:10,color:th.text}}>All entries</div>
              {weights.length===0&&<p style={{fontSize:13,color:th.sub,margin:0}}>No entries yet. Start logging! 🏁</p>}
              {weights.slice().reverse().map((w,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:`0.5px solid ${th.border}`,fontSize:14}}>
                  <span style={{color:th.sub}}>{fmt(w.date)}</span>
                  <div style={{display:"flex",alignItems:"center",gap:14}}><span style={{fontWeight:500,color:th.text}}>{fmtW(w.value)} kg</span><button onClick={()=>setWeights(weights.filter((_,j)=>weights.length-1-j!==i))} style={{fontSize:11,padding:"2px 8px",color:th.sub,background:"transparent",border:`0.5px solid ${th.border}`,borderRadius:6,cursor:"pointer"}}>Remove</button></div>
                </div>
              ))}
            </SectionCard>
          </div>
        )}

        {tab==="Workout"&&(
          <div>
            <SectionCard th={th}>
              <div style={{fontSize:15,fontWeight:500,marginBottom:14,color:th.text}}>💪 Log exercise</div>
              <Label th={th}>Muscle group</Label>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
                {MUSCLES.map(m=><button key={m} onClick={()=>handleMuscleChange(m)} style={{padding:"6px 12px",fontSize:13,borderRadius:20,cursor:"pointer",background:exMuscle===m?"#6C63FF":th.surface,color:exMuscle===m?"#fff":th.sub,border:`0.5px solid ${exMuscle===m?"#6C63FF":th.border}`,fontWeight:exMuscle===m?500:400}}>{MUSCLE_ICONS[m]} {m}</button>)}
              </div>
              <Label th={th}>Exercise</Label>
              <select value={exName} onChange={e=>setExName(e.target.value)} style={{...iS,marginBottom:14}}>{EXERCISES[exMuscle].map(e=><option key={e}>{e}</option>)}</select>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                <div><Label th={th}>Sets</Label><input type="number" value={exSets} onChange={e=>setExSets(e.target.value)} style={iS}/></div>
                <div><Label th={th}>Reps</Label><input type="number" value={exReps} onChange={e=>setExReps(e.target.value)} style={iS}/></div>
                <div><Label th={th}>Weight (kg)</Label><input type="number" placeholder="Optional" value={exKg} onChange={e=>setExKg(e.target.value)} style={iS}/></div>
              </div>
              <Label th={th}>Date</Label>
              <input type="date" value={exDate} onChange={e=>setExDate(e.target.value)} style={{...iS,marginBottom:14}}/>
              <button onClick={addWorkout} style={{width:"100%",background:"#6C63FF",color:"#fff",border:"none",padding:"10px",borderRadius:10,fontSize:14,fontWeight:500,cursor:"pointer"}}>Log exercise ✓</button>
            </SectionCard>
            {workouts.length===0&&<p style={{fontSize:13,color:th.sub}}>No workouts yet — go smash it! 🏋️</p>}
            {Object.entries(workouts.reduce((acc,w)=>{(acc[w.date]=acc[w.date]||[]).push(w);return acc;},{})).sort((a,b)=>b[0].localeCompare(a[0])).map(([date,exs])=>(
              <SectionCard key={date} th={th}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}><span style={{fontSize:13,fontWeight:500,color:th.text}}>{fmt(date)}</span><span style={{fontSize:11,background:th.surface,padding:"3px 8px",borderRadius:10,color:th.sub}}>{exs.length} exercise{exs.length>1?"s":""}</span></div>
                {exs.map((w,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`0.5px solid ${th.border}`}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:16}}>{MUSCLE_ICONS[w.muscle]}</span><div><div style={{fontWeight:500,fontSize:14,color:th.text}}>{w.name}</div><div style={{fontSize:11,color:th.sub}}>{w.muscle}</div></div></div>
                    <div style={{textAlign:"right",fontSize:13}}><span style={{fontWeight:500,color:th.text}}>{w.sets}×{w.reps}</span>{w.kg&&<div style={{fontSize:12,color:th.sub}}>{w.kg} kg</div>}</div>
                  </div>
                ))}
              </SectionCard>
            ))}
          </div>
        )}

        {tab==="Calories"&&(
          <div>
            <SectionCard th={th}>
              <div style={{fontSize:15,fontWeight:500,marginBottom:14,color:th.text}}>🔥 Log food</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
                {FOOD_CATS.map(c=><button key={c} onClick={()=>setFoodCat(c)} style={{padding:"5px 12px",fontSize:12,borderRadius:20,cursor:"pointer",background:foodCat===c?"#6C63FF":th.surface,color:foodCat===c?"#fff":th.sub,border:`0.5px solid ${foodCat===c?"#6C63FF":th.border}`}}>{c}</button>)}
              </div>
              <input placeholder="🔍 Search food..." value={foodSearch} onChange={e=>setFoodSearch(e.target.value)} style={{...iS,marginBottom:8}}/>
              <div style={{maxHeight:210,overflowY:"auto",border:`0.5px solid ${th.border}`,borderRadius:10,marginBottom:12}}>
                {filteredFoods.map((f,i)=>(
                  <div key={i} onClick={()=>{setSelectedFood(f);setFoodQty(1);}} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 12px",cursor:"pointer",fontSize:13,background:selectedFood?.name===f.name?th.surface:"transparent",borderBottom:`0.5px solid ${th.border}`}}>
                    <span style={{fontWeight:selectedFood?.name===f.name?500:400,color:selectedFood?.name===f.name?"#6C63FF":th.text}}>{f.name}</span>
                    <div style={{display:"flex",gap:10,fontSize:12}}><span style={{color:"#D85A30",fontWeight:500}}>{f.cal} kcal</span><span style={{color:th.sub}}>P:{f.protein}g</span></div>
                  </div>
                ))}
                {filteredFoods.length===0&&<div style={{padding:14,fontSize:13,color:th.sub,textAlign:"center"}}>No foods found 🤔</div>}
              </div>
              {selectedFood&&(
                <div style={{background:th.surface,border:`0.5px solid ${th.border}`,borderRadius:10,padding:"12px 14px",marginBottom:12}}>
                  <div style={{fontSize:13,fontWeight:500,color:"#6C63FF",marginBottom:8}}>{selectedFood.name}</div>
                  <div style={{display:"flex",gap:8,marginBottom:10}}>
                    {[["Calories",Math.round(selectedFood.cal*foodQty)+" kcal","#D85A30"],["Protein",Math.round(selectedFood.protein*foodQty)+"g","#3266ad"],["Carbs",Math.round(selectedFood.carbs*foodQty)+"g","#BA7517"],["Fat",Math.round(selectedFood.fat*foodQty)+"g","#639922"]].map(([l,v,c])=>(
                      <div key={l} style={{flex:1,background:th.card,border:`0.5px solid ${th.border}`,borderRadius:8,padding:"6px 4px",textAlign:"center"}}><div style={{fontSize:10,color:th.sub,marginBottom:2}}>{l}</div><div style={{fontSize:14,fontWeight:500,color:c}}>{v}</div></div>
                    ))}
                  </div>
                  <div style={{display:"flex",gap:8}}>
                    <div style={{flex:1}}><Label th={th}>Quantity</Label><input type="number" min="0.5" step="0.5" value={foodQty} onChange={e=>setFoodQty(Number(e.target.value)||1)} style={iS}/></div>
                    <div style={{flex:1}}><Label th={th}>Date</Label><input type="date" value={cDate} onChange={e=>setCDate(e.target.value)} style={iS}/></div>
                  </div>
                </div>
              )}
              <button onClick={addFood} disabled={!selectedFood} style={{width:"100%",background:selectedFood?"#6C63FF":th.surface,color:selectedFood?"#fff":th.sub,border:"none",padding:"10px",borderRadius:10,fontSize:14,fontWeight:500,cursor:selectedFood?"pointer":"not-allowed"}}>{selectedFood?`Add ${selectedFood.name} ✓`:"Select a food above"}</button>
            </SectionCard>
            {calories.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:14}}><StatCard th={th} label="Today" value={`${todayCals}`} sub="kcal" color="#D85A30"/><StatCard th={th} label="Daily avg" value={`${avgCals}`} sub="kcal"/><StatCard th={th} label="Total logs" value={calories.length} sub="entries"/></div>}
            {Object.entries(calories.reduce((acc,c)=>{(acc[c.date]=acc[c.date]||[]).push(c);return acc;},{})).sort((a,b)=>b[0].localeCompare(a[0])).map(([date,items])=>{
              const total=items.reduce((a,c)=>a+Number(c.cal),0);
              const tP=items.reduce((a,c)=>a+(c.protein||0),0),tC=items.reduce((a,c)=>a+(c.carbs||0),0),tF=items.reduce((a,c)=>a+(c.fat||0),0);
              return (
                <SectionCard key={date} th={th}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}><div><div style={{fontSize:13,fontWeight:500,color:th.text}}>{fmt(date)}</div><div style={{fontSize:11,color:th.sub,marginTop:2}}>P:{tP}g · C:{tC}g · F:{tF}g</div></div><div style={{fontSize:15,fontWeight:500,color:"#D85A30"}}>{total} kcal</div></div>
                  {items.map((c,i)=>(
                    <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:`0.5px solid ${th.border}`,fontSize:13}}>
                      <span style={{color:th.text}}>{c.food}</span>
                      <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{color:th.sub}}>{c.cal} kcal</span><button onClick={()=>setCalories(calories.filter(x=>x!==c))} style={{fontSize:11,padding:"2px 8px",color:th.sub,background:"transparent",border:`0.5px solid ${th.border}`,borderRadius:6,cursor:"pointer"}}>Remove</button></div>
                    </div>
                  ))}
                </SectionCard>
              );
            })}
            {calories.length===0&&<p style={{fontSize:13,color:th.sub}}>No food logged yet. Fuel your gains! 🥗</p>}
          </div>
        )}

        {tab==="Calculator"&&<CalcTab th={th}/>}
      </div>
    </div>
  );
}
