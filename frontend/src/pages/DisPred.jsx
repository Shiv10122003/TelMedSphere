import React, { useContext, useEffect, useState } from "react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import Preloader from "../components/common/Preloader";
import commonContext from "../contexts/common/commonContext";
import useScrollDisable from "../hooks/useScrollDisable";
import { useNavigate } from "react-router-dom";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import Darkmode from './components/Darkmode/Darkmode.jsx'
function DisPred() {

  const { isLoading, toggleLoading } = useContext(commonContext);

  useEffect(() => {
      toggleLoading(true);
      setTimeout(() => toggleLoading(false), 2000);
  }, []);

  useScrollDisable(isLoading);    

  const API_KEY = import.meta.env.VITE_API_KEY;
  const systemMessage = {
    role: "system",
    content: `
    1. Predict patient's disease in maximum 50 words based on given symptoms, age, past medical history and sex
    2. Give output as possible diseases, their individual accuracy in percentage, their cure and preventive health tips
    3. Dont relate yourself to chatgpt or open ai`,
  };
  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () =>
      window.scrollY >= 100 ? setIsVisible(true) : setIsVisible(false);
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // back-to-top functionality
  const handleBackTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  

  const HEALTH_KEYWORDS = ["health", "medicine", "doctor", "hospital", "symptom", "colour blindness","myopia","hypermetropia","bronchitis","cough",
  "cold","tuberculosis","TB","dry eyes","eye","chalization","appendictius","dysepia","food poison","food poisoning","gastritis",
  "ibs","peptic ulcer","ulcer","coitis","allergy","kidney","kidney failure","kidney stone",,"fever","stone","appendix", "food allergy", 
  "vomit","pain", "Abdomen acute", "Abdominal bloating", "Abdominal tenderness", "Abnormal sensation","Abnormally hard consistency","Abscess bacterial",
    "Absences finding","Achalasia","Ache","Adverse effect","Adverse reaction","Agitation","Air fluid level","Alcohol binge episode","Alcoholic withdrawal symptoms",
    "Ambidexterity","Angina pectoris","Anorexia","Anosmia","Aphagia","Apyrexial","Arthralgia","Ascites","Asterixis","Asthenia","Asymptomatic","Ataxia",
    "Atypia","Aura","Awakening early","Barking cough","Bedridden","Behavior hyperactive","Behavior showing increased motor activity","Blackout",
    "Blanch","Bleeding of vagina","Bowel sounds decreased","Bradycardia","Bradykinesia","Breakthrough pain","Breath sounds decreased","Breath-holding spell",
    "Breech presentation", "Bruit","Burning sensation","Cachexia","Cardiomegaly","Cardiovascular event","Cardiovascular finding","Catatonia","Catching breath","Charleyhorse",
    "Chest discomfort","Chest tightness","Chill","Choke","Cicatrisation","Clammy skin","Claudication","Clonus","Clumsiness","Colic abdominal","Consciousness clear","Constipation",
    "Coordination abnormal","Cough","Cushingoid facies","Cushingoid\u00a0habitus","Cyanosis","Cystic lesion","Debilitation","Decompensation","Decreased body weight","Decreased stool caliber",
    "Decreased translucency","Diarrhea","Difficulty","Difficulty passing urine","Disequilibrium","Distended abdomen","Distress respiratory","Disturbed family","Dizziness",
    "Dizzy spells","Drool","Drowsiness","Dry cough","Dullness","Dysarthria","Dysdiadochokinesia","Dysesthesia","Dyspareunia","Dyspnea","Dyspnea on exertion","Dysuria",
    "Ecchymosis","Egophony","Elation","Emphysematous change","Energy increased","Enuresis","Erythema","Estrogen use","Excruciating pain","Exhaustion","Extrapyramidal sign","Extreme exhaustion",
    "Facial paresis","Fall","Fatigability","Fatigue","Fear of falling","Fecaluria","Feces in rectum","Feeling hopeless","Feeling strange","Feeling suicidal","Feels hot/feverish",
    "Fever","Flare","Flatulence","Floppy","Flushing","Focal seizures","Food intolerance","Formication","Frail","Fremitus","Frothy sputum","Gag","Gasping for breath","General discomfort","General unsteadiness","Giddy mood","Gravida 0","Gravida 10","Green sputum",
    "Groggy","Guaiac positive","Gurgle","Hacking cough","Haemoptysis","Haemorrhage","Hallucinations auditory","Hallucinations visual",    "Has religious belief",    "Headache",    "Heartburn","Heavy feeling",    "Heavy legs",    "Heberden's node",    "Hematochezia","Hematocrit decreased",
    "Hematuria","Heme positive","Hemianopsia homonymous","Hemiplegia","Hemodynamically stable","Hepatomegaly","Hepatosplenomegaly",    "Hirsutism",    "History of - blackout","Hoard","Hoarseness","Homelessness","Homicidal thoughts","Hot flush",
    "Hunger",    "Hydropneumothorax",    "Hyperacusis","Hypercapnia","Hyperemesis","Hyperhidrosis disorder","Hyperkalemia","Hypersomnia","Hypersomnolence","Hypertonicity","Hyperventilation",    "Hypesthesia",    "Hypoalbuminemia",    "Hypocalcemia result",    "Hypokalemia",    "Hypokinesia","Hypometabolism",
    "Hyponatremia","Hypoproteinemia","Hypotension","Hypothermia, natural","Hypotonic","Hypoxemia","Immobile",    "Impaired cognition","Inappropriate affect","Incoherent","Indifferent mood","Intermenstrual heavy bleeding","Intoxication",    "Irritable mood",    "Jugular venous distention",    "Labored breathing","Lameness",
    "Large-for-dates fetus","Left\u00a0atrial\u00a0hypertrophy","Lesion","Lethargy","Lightheadedness","Lip smacking","Loose associations","Loss of taste or smell",    "Low back pain",    "Lung nodule","Macerated skin","Macule","Malaise","Mass in breast","Mass of body structure","Mediastinal shift","Mental status changes",
    "Metastatic lesion","Milky","Moan","Monoclonal","Monocytosis","Mood depressed","Moody","Motor retardation","Murphy's sign","Muscle hypotonia","Muscle twitch","Myalgia","Mydriasis","Myoclonus","Nasal discharge present","Nasal flaring",    "Nausea","Nausea and vomiting","Neck stiffness","Neologism",    "Nervousness","Night sweat","Nightmare",
    "No known drug allergies","No status change","Noisy respiration","Non-productive cough","Nonsmoker","Numbness","Numbness of hand","Oliguria","Orthopnea",    "Orthostasis","Out of breath","Overweight","Pain",    "Pain abdominal","Pain back","Pain chest","Pain foot","Pain in lower limb","Pain neck","Painful swallowing","Pallor",    "Palpitation","Panic",
    "Pansystolic murmur","Paralyse","Paraparesis","Paresis","Paresthesia","Passed stones","Patient non compliance","Pericardial friction rub","Phonophobia","Photophobia","Photopsia","Pin-point pupils","Pleuritic pain","Pneumatouria",    "Polydypsia",    "Polymyalgia",    "Polyuria","Poor dentition","Poor feeding","Posterior\u00a0rhinorrhea","Posturing","Presence of q wave","Pressure chest",
    "Previous pregnancies 2","Primigravida","Prodrome","Productive cough","Projectile vomiting",    "Prostate tender",    "Prostatism","Proteinemia","Pruritus","Pulse absent",    "Pulsus\u00a0paradoxus","Pustule","Qt interval prolonged",
    "R wave feature","Rale","Rambling speech","Rapid shallow breathing","Red blotches","Redness","Regurgitates after swallowing",    "Renal angle tenderness","Rest pain","Retch",    "Retropulsion","Rhd positive",    "Rhonchus",    "Rigor - temperature-associated observation",    "Rolling of eyes",    "Room spinning","Satiety early","Scar tissue",    "Sciatica","Scleral\u00a0icterus","Scratch marks","Sedentary",    "Seizure",
    "Sensory discomfort","Shooting pain","Shortness of breath","Side pain","Sinus rhythm","Sleeplessness","Sleepy","Slowing of urinary stream",    "Sneeze",    "Sniffle",    "Snore",    "Snuffle",    "Soft tissue swelling","Sore to touch","Spasm","Speech slurred",    "Splenomegaly",    "Spontaneous rupture of membranes","Sputum purulent","St segment depression","St segment elevation",    "Stahli's line","Stiffness","Stinging sensation","Stool color yellow",    "Stridor",    "Stuffy nose",
    "Stupor","Suicidal","Superimposition","Sweat",    "Sweating increased","Swelling","Symptom aggravating factors","Syncope","Systolic ejection murmur","Systolic murmur","T wave inverted","Tachypnea","Tenesmus",    "Terrify","Thicken",    "Throat sore",    "Throbbing sensation quality",    "Tinnitus",    "Titubation",    "Todd paralysis",    "Tonic seizures",    "Transaminitis","Transsexual",    "Tremor",    "Tremor resting","Tumor cell invasion","Unable to concentrate",
    "Unconscious state","Uncoordination",    "Underweight","Unhappy",    "Unresponsiveness", "cancer",   "Unsteady gait",    "Unwell",    "Urge incontinence",    "Urgency of\u00a0micturition",    "Urinary hesitation",    "Urinoma",    "Verbal auditory hallucinations",    "Verbally abusive behavior",    "Vertigo",    "Vision blurred",    "Vomiting",    "Weepiness","Weight gain",    "Welt","Wheelchair bound","Wheezing","Withdraw",    "Worry",    "Yellow sputum"
  ];

const handleSend = async (message) => {
  const newMessage = {
    message,
    direction: "outgoing",
    sender: "user",
  };
  
  const containsHealthKeywords = HEALTH_KEYWORDS.some(keyword => message.toLowerCase().includes(keyword));
  
  if (!containsHealthKeywords) {
    setMessages([
      ...messages,
      {
        message: "I'm sorry, I can only answer health-related questions.",
        sender: "ChatGPT",
      },
    ]);
    return;
  }

  const newMessages = [...messages, newMessage];

  setMessages(newMessages);
  setIsTyping(true);
  await processMessageToChatGPT(newMessages);
};


  const [messages, setMessages] = useState([
    {
      message: "Welcome to PredBot!! Specify age, sex, symptoms and past medical history",
      sentTime: "just now",
      sender: "ChatGPT",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // const handleSend = async (message) => {
  //   const newMessage = {
  //     message,
  //     direction: "outgoing",
  //     sender: "user",
  //   };

  //   const newMessages = [...messages, newMessage];

  //   setMessages(newMessages);
  //   setIsTyping(true);
  //   await processMessageToChatGPT(newMessages);
  // };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };
    
    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setIsTyping(false);
      });      
  }


  if(isLoading) {
    return <Preloader />;
  }

  return (
    <div className="flex justify-center items-center mb-[20px] mt-10">
      <div className="relative h-[550px] max-w-[500px] mx-6">
      <Darkmode />
        <MainContainer>
          <ChatContainer className="pt-2 -ml-[0.5rem]">
            <MessageList
              scrollBehavior="smooth"
              typingIndicator={
                isTyping ? (
                  <TypingIndicator content="PredBot is typing" />
                ) : null
              }
            >
              {messages.map((message, i) => {
                console.log(message);
                return <Message key={i} model={message} />;
              })}
            </MessageList>
            <MessageInput placeholder="Type message here" onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  );
}

export default DisPred;