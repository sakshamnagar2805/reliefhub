import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  X, 
  Volume2, 
  VolumeX, 
  Send, 
  Droplets, 
  Home, 
  HeartHandshake, 
  LifeBuoy, 
  Phone, 
  CheckCircle2, 
  AlertTriangle,
  ChevronDown,
  Sparkles,
  Bot,
  ExternalLink,
  PlusCircle,
  Headphones
} from 'lucide-react';

const INTENT_KNOWLEDGE_BASE = {
  en: [
    {
      keywords: ['water', 'drink', 'thirsty', 'dehydration', 'bottle', 'clean water'],
      category: 'Water',
      urgency: 'Critical',
      title: 'Drinking Water Emergency Relief',
      reply: 'Purified drinking water supplies are actively available at Sector A (Gandhi Nagar) and Sector C Depot. We can instantly dispatch a 20L water pack to your exact coordinates.',
      action: 'ticket',
      defaultLocation: 'Sector A — Gandhi Nagar'
    },
    {
      keywords: ['shelter', 'camp', 'stay', 'flood', 'house', 'evacuate', 'bed', 'sleep'],
      category: 'Shelter',
      urgency: 'High',
      title: 'Evacuation Camps & Bed Availability',
      reply: '4 Emergency Evacuation Shelters are operational. Nearest is Rajiv Gandhi Indoor Stadium (26 beds available, Langar food & medical bay). Manager: Col. Vikram Rathore (+91 98101 00100).',
      action: 'shelter',
      defaultLocation: 'Sector A — Gandhi Nagar'
    },
    {
      keywords: ['food', 'hungry', 'meal', 'ration', 'packet', 'khichdi', 'eat'],
      category: 'Food',
      urgency: 'High',
      title: 'Emergency Food & Meal Packets',
      reply: 'Fresh langar meals & dry ration packs are being coordinated by Akshaya Patra & Gurdwara Langar Seva across Subhash Chowk and Gandhi Nagar.',
      action: 'ticket',
      defaultLocation: 'Sector B — Subhash Chowk'
    },
    {
      keywords: ['medicine', 'doctor', 'insulin', 'injury', 'bleed', 'medical', 'fever', 'bandage'],
      category: 'Medicine',
      urgency: 'Critical',
      title: 'Urgent Medical Attention',
      reply: 'Primary medical corps led by Dr. Rajesh Kulkarni (IMA Medical Corps) is stationed at Sector A PHC. Dialing 112 connects to NDRF Mobile Field Hospital.',
      action: 'ticket',
      defaultLocation: 'Sector A — Gandhi Nagar'
    },
    {
      keywords: ['boat', 'rescue', 'trapped', 'stranded', 'drown', 'roof', 'surrounded'],
      category: 'Rescue',
      urgency: 'Critical',
      title: 'Emergency NDRF Evacuation Boat',
      reply: '⚠️ URGENT RESCUE ALERT: NDRF 8th Battalion motorized rescue boats are patrolling Sector 04 Yamuna Riverfront. Keep your phone charged & stay on elevated structures.',
      action: 'ticket',
      defaultLocation: 'Sector 04 — Yamuna Riverfront'
    },
    {
      keywords: ['donate', 'volunteer', 'offer', 'give', 'help others', 'supplies'],
      category: 'Supply',
      urgency: 'Normal',
      title: 'Volunteer Supply Intake',
      reply: 'Thank you for stepping forward! You can register surplus food, water, or medicines directly into the live inventory via the "Offer Supplies" button on the top bar.',
      action: 'volunteer',
      defaultLocation: 'Sector C — Industrial Area Depot'
    },
    {
      keywords: ['helpline', 'phone', 'contact', 'number', 'call', 'police', 'ambulance'],
      category: 'Helpline',
      urgency: 'Normal',
      title: 'Government Disaster Helplines',
      reply: '• National Emergency: 112\n• NDRF Control Room: 1070 / +91 11-24363260\n• State Disaster Management (SDRF): 1077\n• ReliefHub Sector Command: +91 98101 00100',
      action: 'none',
      defaultLocation: 'Control Room'
    }
  ],
  hi: [
    {
      keywords: ['पानी', 'जल', 'प्यास', 'पीने', 'बोतल'],
      category: 'Water',
      urgency: 'Critical',
      title: 'पेयजल आपातकालीन सहायता',
      reply: 'गांधी नगर (सेक्टर A) और सेंट्रल डिपो में शुद्ध पेयजल की आपूर्ति उपलब्ध है। हम तुरंत आपके स्थान पर 20 लीटर पानी का पैक भेज सकते हैं।',
      action: 'ticket',
      defaultLocation: 'Sector A — Gandhi Nagar'
    },
    {
      keywords: ['शेल्टर', 'शिविर', 'रहने', 'घर', 'बाढ़', 'बेड', 'कहाँ जाएं', 'ठहरने'],
      category: 'Shelter',
      urgency: 'High',
      title: 'निकटतम राहत शिविर व बेड उपलब्धता',
      reply: '4 राहत शिविर चालू हैं। सबसे पास "राजीव गांधी इंडोर स्टेडियम" है (26 बेड खाली, 24x7 लंगर भोजन व चिकित्सा उपलब्ध)। प्रबंधक: कर्नल विक्रम राठौर (+91 98101 00100)।',
      action: 'shelter',
      defaultLocation: 'Sector A — Gandhi Nagar'
    },
    {
      keywords: ['खाना', 'भोजन', 'भूख', 'राशन', 'खिचड़ी', 'रोटी'],
      category: 'Food',
      urgency: 'High',
      title: 'आपातकालीन भोजन व सूखा राशन',
      reply: 'अक्षय पात्र फाउंडेशन और गुरुद्वारा लंगर सेवा द्वारा सुभाष चौक और गांधी नगर में तैयार भोजन पैकेट वितरित किए जा रहे हैं।',
      action: 'ticket',
      defaultLocation: 'Sector B — Subhash Chowk'
    },
    {
      keywords: ['दवा', 'डॉक्टर', 'इंसुलिन', 'चोट', 'बीमार', 'बुखार', 'पट्टी'],
      category: 'Medicine',
      urgency: 'Critical',
      title: 'आपातकालीन चिकित्सा सहायता',
      reply: 'डॉ. राजेश कुलकर्णी (आईएमए मेडिकल कॉर्प्स) प्राथमिक स्वास्थ्य केंद्र सेक्टर A में उपस्थित हैं। तुरंत सहायता के लिए 112 डायल करें।',
      action: 'ticket',
      defaultLocation: 'Sector A — Gandhi Nagar'
    },
    {
      keywords: ['नाव', 'बचाव', 'फंसे', 'रेस्क्यू', 'डूब', 'छत', 'घिरे'],
      category: 'Rescue',
      urgency: 'Critical',
      title: 'एनडीआरएफ मोटरबोट बचाव दल',
      reply: '⚠️ अति-आवश्यक सूचना: NDRF 8वीं बटालियन की मोटरबोट यमुना तट (सेक्टर 04) पर सक्रिय हैं। कृपया ऊंचे स्थान पर रहें और फोन ऑन रखें।',
      action: 'ticket',
      defaultLocation: 'Sector 04 — Yamuna Riverfront'
    },
    {
      keywords: ['दान', 'मदद करना', 'सामग्री देना', 'वालंटियर', 'सहयोग'],
      category: 'Supply',
      urgency: 'Normal',
      title: 'राहत सामग्री पंजीकरण',
      reply: 'आपके सहयोग के लिए धन्यवाद! आप ऊपर दिए गए "Offer Supplies" बटन से राशन, पानी या दवाइयां सीधे डिपो में दर्ज कर सकते हैं।',
      action: 'volunteer',
      defaultLocation: 'Sector C — Industrial Area Depot'
    },
    {
      keywords: ['नंबर', 'फोन', 'हेल्पलाइन', 'कॉल', 'संपर्क'],
      category: 'Helpline',
      urgency: 'Normal',
      title: 'राष्ट्रीय आपदा हेल्पलाइन नंबर',
      reply: '• राष्ट्रीय आपातकालीन नंबर: 112\n• NDRF कंट्रोल रूम: 1070 / +91 11-24363260\n• राज्य आपदा प्रबंधन (SDRF): 1077\n• रिलीफहब फील्ड डेस्क: +91 98101 00100',
      action: 'none',
      defaultLocation: 'Control Room'
    }
  ]
};

const SUGGESTED_PROMPTS = {
  en: [
    { label: '💧 Request Clean Water', query: 'Need drinking water urgently' },
    { label: '⛺ Nearest Safe Shelter', query: 'Where is nearest evacuation camp?' },
    { label: '🚨 SOS Trapped in Flood', query: 'Trapped family needs rescue boat' },
    { label: '📊 Live Inventory & Crisis Data', query: 'What is the current stock of water and food?' },
    { label: '📞 NDRF Helplines (1070)', query: 'Emergency contact numbers' }
  ],
  hi: [
    { label: '💧 पीने का पानी चाहिए', query: 'पीने का पानी तुरंत चाहिए' },
    { label: '⛺ नजदीकी राहत शिविर', query: 'निकटतम राहत शिविर कहाँ है?' },
    { label: '🚨 बाढ़ में फंसे लोग (SOS)', query: 'बाढ़ में फंसे हैं बचाव नाव चाहिए' },
    { label: '📊 लाइव स्टॉक व डेटा', query: 'राहत डिपो में पानी और खाने का क्या स्टॉक है?' },
    { label: '📞 आपदा हेल्पलाइन (1070)', query: 'आपातकालीन हेल्पलाइन नंबर' }
  ]
};

// Data-Grounded Query & Ambiguity Classifier
function processEmergencyQuery(query, language, requests = [], resources = []) {
  const lower = query.toLowerCase().trim();

  // 1. Check for Greetings
  const isGreeting = /^(hi|hello|hey|namaste|नमस्ते|halo|good morning|good evening|pranam)\b/i.test(lower);
  if (isGreeting && lower.split(/\s+/).length <= 3) {
    return {
      category: 'Support',
      urgency: 'Normal',
      title: language === 'hi' ? 'नमस्ते • रिलीफहब सहायता' : 'ReliefHub Crisis Desk',
      reply: language === 'hi'
        ? 'नमस्ते! मैं रिलीफहब का 24x7 आपदा राहत सहायक हूँ। हम पीने का पानी, राशन, आपातकालीन दवाइयां, बचाव नाव या राहत शिविर उपलब्ध कराने में आपकी मदद कर सकते हैं। आप क्या सहायता चाहते हैं?'
        : 'Hello! I am ReliefHub’s 24x7 Disaster Response Assistant. I can assist you with emergency drinking water, ration packets, medical triage, evacuation shelters, or NDRF rescue boats. How can we help?',
      action: 'none',
      defaultLocation: 'Sector A — Gandhi Nagar'
    };
  }

  // 2. Data Grounding & Analytics Queries (Analyzes live application data)
  
  // 2A. Water Stock / Availability Query
  const isWaterStock = lower.includes('water stock') || lower.includes('how much water') || lower.includes('water available') || lower.includes('पानी कितना') || lower.includes('पानी का स्टॉक') || lower.includes('पानी उपलब्ध') || lower.includes('drinking water available');
  if (isWaterStock) {
    const waterResources = (resources || []).filter(r => r.category === 'Water');
    const totalWater = waterResources.reduce((sum, r) => sum + (r.availableQuantity || 0), 0);
    const locations = [...new Set(waterResources.map(r => r.location))].join(', ');
    return {
      category: 'Water',
      urgency: 'Critical',
      title: language === 'hi' ? 'पेयजल लाइव इन्वेंटरी विश्लेषण' : 'Drinking Water Stock Analysis',
      reply: language === 'hi'
        ? `📊 लाइव डेटा विश्लेषण: वर्तमान में राहत डिपो में कुल ${totalWater} यूनिट शुद्ध पेयजल उपलब्ध है (${locations || 'Sector A — Gandhi Nagar'})। क्या आप अपने स्थान पर 20L पानी का पैक मंगाना चाहते हैं?`
        : `📊 Live Data Analysis: There are currently ${totalWater} units of purified drinking water available in active inventory (${locations || 'Sector A — Gandhi Nagar'}). You can dispatch a water pack directly using the button below.`,
      action: 'ticket',
      defaultLocation: 'Sector A — Gandhi Nagar'
    };
  }

  // 2B. Food / Ration Stock Query
  const isFoodStock = lower.includes('food stock') || lower.includes('how much food') || lower.includes('ration available') || lower.includes('meals available') || lower.includes('खाना कितना') || lower.includes('राशन स्टॉक') || lower.includes('खाने का क्या स्टॉक');
  if (isFoodStock) {
    const foodResources = (resources || []).filter(r => r.category === 'Food');
    const totalFood = foodResources.reduce((sum, r) => sum + (r.availableQuantity || 0), 0);
    return {
      category: 'Food',
      urgency: 'High',
      title: language === 'hi' ? 'भोजन व राशन स्टॉक विश्लेषण' : 'Food & Ration Stock Analysis',
      reply: language === 'hi'
        ? `📊 लाइव डेटा विश्लेषण: वर्तमान में ${totalFood} भोजन व सूखा राशन पैकेट वितरण के लिए उपलब्ध हैं (Akshaya Patra Foundation & Gurdwara Seva)। क्या आपके क्षेत्र में भोजन वितरण की आवश्यकता है?`
        : `📊 Live Data Analysis: We have ${totalFood} fresh meal & dry ration packets in stock (Akshaya Patra & Gurdwara Langar Seva). Would you like to queue a ration delivery?`,
      action: 'ticket',
      defaultLocation: 'Sector B — Subhash Chowk'
    };
  }

  // 2C. Medical Availability Query
  const isMedStock = lower.includes('medicine stock') || lower.includes('medical stock') || lower.includes('doctor available') || lower.includes('दवा कितनी') || lower.includes('डॉक्टर उपलब्ध');
  if (isMedStock) {
    const medResources = (resources || []).filter(r => r.category === 'Medicine');
    const totalMed = medResources.reduce((sum, r) => sum + (r.availableQuantity || 0), 0);
    return {
      category: 'Medicine',
      urgency: 'Critical',
      title: language === 'hi' ? 'चिकित्सा सहायता व दवा इन्वेंटरी' : 'Medical Corps Stock Analysis',
      reply: language === 'hi'
        ? `📊 लाइव डेटा विश्लेषण: प्राथमिक स्वास्थ्य केंद्र (Sector A) में डॉ. राजेश कुलकर्णी के पास ${totalMed} यूनिट जीवन रक्षक दवाइयां एवं प्राथमिक चिकित्सा किट उपलब्ध हैं।`
        : `📊 Live Data Analysis: ${totalMed} first-aid kits and emergency medicine units are available with Dr. Rajesh Kulkarni (IMA Medical Corps) at Sector A PHC.`,
      action: 'ticket',
      defaultLocation: 'Sector A — Gandhi Nagar'
    };
  }

  // 2D. Crisis Overview / Request Status
  const isStatusQuery = lower.includes('crisis status') || lower.includes('situation report') || lower.includes('pending requests') || lower.includes('how many requests') || lower.includes('कितने लोग') || lower.includes('आपदा स्थिति') || lower.includes('रिपोर्ट') || lower.includes('stock of water and food');
  if (isStatusQuery) {
    const pendingCount = (requests || []).filter(r => r.status === 'Pending').length;
    const criticalCount = (requests || []).filter(r => r.urgency === 'Critical').length;
    const resolvedCount = (requests || []).filter(r => r.status === 'Resolved').length;
    return {
      category: 'Support',
      urgency: 'Normal',
      title: language === 'hi' ? 'लाइव आपदा नियंत्रण रिपोर्ट' : 'Live Crisis Grid Report',
      reply: language === 'hi'
        ? `📊 रिलीफहब डेटा विश्लेषण रिपोर्ट:\n• कुल दर्ज आवश्यकताएं: ${(requests || []).length}\n• लंबित (Pending) सहायता: ${pendingCount}\n• अति-गंभीर (Critical Life-Risk): ${criticalCount}\n• सुरक्षित वितरित (Resolved): ${resolvedCount}\n• सक्रिय राहत दल (Volunteers): ${(resources || []).length}`
        : `📊 ReliefHub Data Analysis Report:\n• Total Distress Reports: ${(requests || []).length}\n• Pending Dispatch: ${pendingCount}\n• Critical (Life-Risk): ${criticalCount}\n• Safely Resolved: ${resolvedCount}\n• Active Volunteer Corps: ${(resources || []).length}`,
      action: 'none',
      defaultLocation: 'Control Room'
    };
  }

  // 2E. Sector-Specific Status (Gandhi Nagar, Subhash Chowk)
  if (lower.includes('gandhi') || lower.includes('गांधी')) {
    const reqsInSec = (requests || []).filter(r => r.location.toLowerCase().includes('gandhi'));
    return {
      category: 'Rescue',
      urgency: 'Critical',
      title: language === 'hi' ? 'गांधी नगर (सेक्टर A) स्थिति' : 'Sector A — Gandhi Nagar Status',
      reply: language === 'hi'
        ? `📊 सेक्टर A स्थिति: उच्च बाढ़ चेतावनी सक्रिय है। ${reqsInSec.length} राहत अनुरोध दर्ज हैं। Goonj Seva द्वारा पेयजल व प्राथमिक उपचार केंद्र चालू है।`
        : `📊 Sector A Analysis: High flood alert active. ${reqsInSec.length} relief requests logged. Goonj Relief Seva and Mobile Medical PHC are actively operational here.`,
      action: 'ticket',
      defaultLocation: 'Sector A — Gandhi Nagar'
    };
  }

  if (lower.includes('subhash') || lower.includes('सुभाष')) {
    const reqsInSec = (requests || []).filter(r => r.location.toLowerCase().includes('subhash'));
    return {
      category: 'Food',
      urgency: 'High',
      title: language === 'hi' ? 'सुभाष चौक (सेक्टर B) स्थिति' : 'Sector B — Subhash Chowk Status',
      reply: language === 'hi'
        ? `📊 सुभाष चौक स्थिति: कम्युनिटी हॉल में सूखा राशन व भोजन वितरण केंद्र चालू है। ${reqsInSec.length} अनुरोध वर्तमान में ट्रैक किए जा रहे हैं।`
        : `📊 Sector B Analysis: Dry ration and langar meal distribution center active at community hall. ${reqsInSec.length} requests being tracked.`,
      action: 'ticket',
      defaultLocation: 'Sector B — Subhash Chowk'
    };
  }

  // 3. Match Standard Disaster Relief Intents from Knowledge Base
  const langRules = INTENT_KNOWLEDGE_BASE[language] || INTENT_KNOWLEDGE_BASE.en;
  let matched = langRules.find(rule => 
    rule.keywords.some(kw => lower.includes(kw.toLowerCase()))
  );

  // Cross-lingual check: if Hindi query typed in English mode or vice-versa
  if (!matched) {
    const altLang = language === 'en' ? 'hi' : 'en';
    matched = INTENT_KNOWLEDGE_BASE[altLang]?.find(rule => 
      rule.keywords.some(kw => lower.includes(kw.toLowerCase()))
    );
  }

  if (matched) {
    return matched;
  }

  // 4. Ambiguous & Off-Topic Query Handler (e.g. "vaibhav ki shaadi kb hogi", jokes, general chat)
  // Rejects non-disaster inquiries and explains ReliefHub's operational scope instead of logging as distress
  return {
    category: 'OffTopic',
    urgency: 'Normal',
    isOffTopic: true,
    title: language === 'hi' ? 'ℹ️ केवल आपदा राहत सहायता • रिलीफहब' : 'ℹ️ ReliefHub Operational Scope',
    reply: language === 'hi'
      ? 'मैं रिलीफहब (ReliefHub) आपदा सहायता सहायक हूँ। मैं केवल आपातकालीन आपदा प्रबंधन एवं राहत कार्यों (पेयजल, भोजन, चिकित्सा, बचाव नाव, राहत शिविर) के लिए उपलब्ध हूँ। मैं व्यक्तिगत या सामान्य प्रश्नों के उत्तर नहीं दे सकता।\n\nआपदा सहायता के लिए आप निम्न जानकारी ले सकते हैं:\n• 💧 शुद्ध पेयजल या राशन पैकेट मांगें\n• 🏥 आपातकालीन दवाइयां व डॉक्टर सहायता\n• 🚤 बाढ़ में फंसे नागरिकों के लिए NDRF बचाव नाव\n• ⛺ निकटतम राहत शिविर एवं खाली बेड\n• 📞 राष्ट्रीय आपदा हेल्पलाइन नंबर (112, 1070)'
      : 'I am the ReliefHub Crisis Field Relay assistant. I am dedicated exclusively to humanitarian crisis management and disaster relief coordination.\n\nI cannot answer personal, casual, or off-topic questions. However, I can assist you with:\n• 💧 Purified drinking water & food rations\n• 🏥 Emergency medical aid & doctor triage\n• 🚤 NDRF rescue boats for flood-trapped citizens\n• ⛺ Safe evacuation shelters & available beds\n• 📞 Official emergency helplines (112, 1070)\n\nPlease ask a disaster-relief question or click one of the quick options below.',
    action: 'none',
    defaultLocation: 'Sector A — Gandhi Nagar'
  };
}

export default function EmergencyChatbot({ 
  onCreateRequest, 
  onNavigateView, 
  requests = [], 
  resources = [] 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' | 'hi'
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [messages, setMessages] = useState(() => [
    {
      id: 'welcome-1',
      sender: 'bot',
      lang: 'en',
      text: 'ReliefHub National Emergency Field Relay active. How can we assist you with water, medical triage, or evacuation shelters?',
      time: 'Just now'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Voice Readback using Web Speech Synthesis
  const speakText = (text, lang) => {
    if (!voiceEnabled || !window.speechSynthesis) return;

    window.speechSynthesis.cancel(); // Stop current speech
    const cleanText = text.replace(/[•⚠️🚨\[\]]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputMessage).trim();
    if (!query) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg = {
      id: userMsgId,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');

    // Analyze intent using Data-Grounded Query & Ambiguity Classifier
    const matchedRule = processEmergencyQuery(query, language, requests, resources);

    setTimeout(() => {
      const botMsgId = `bot-${Date.now()}`;
      const botMsg = {
        id: botMsgId,
        sender: 'bot',
        lang: language,
        title: matchedRule.title,
        text: matchedRule.reply,
        category: matchedRule.category,
        urgency: matchedRule.urgency,
        defaultLocation: matchedRule.defaultLocation,
        action: matchedRule.action,
        isOffTopic: matchedRule.isOffTopic,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
      speakText(matchedRule.reply, language);
    }, 350);
  };

  // 1-Click Ticket Dispatch directly from Chatbot
  const handleDirectTicketCreation = (category, location, urgency) => {
    const timestamp = Date.now();
    const newRequest = {
      id: `REQ-SOS-${timestamp.toString().slice(-4)}`,
      category: category || 'Water',
      quantity: category === 'Water' ? 25 : category === 'Food' ? 30 : 5,
      allocatedQuantity: 0,
      details: `🚨 CHATBOT SOS INTAKE: Citizen emergency distress reported via Voice/Chat Relay at ${location}`,
      urgency: urgency || 'Critical',
      location: location || 'Sector A — Gandhi Nagar',
      contact: '+91 98110 91100',
      status: 'Pending',
      assignedResourceId: null,
      createdAt: new Date().toISOString()
    };

    if (onCreateRequest) {
      onCreateRequest(newRequest);
    }

    const confirmText = language === 'hi'
      ? `✓ आपातकालीन टिकट #${newRequest.id} दर्ज कर लिया गया है और सीधे कमांड डेस्क को प्रेषित किया गया है!`
      : `✓ Emergency Ticket #${newRequest.id} successfully queued & broadcasted to NDRF Command!`;

    setMessages(prev => [
      ...prev,
      {
        id: `confirm-${Date.now()}`,
        sender: 'bot',
        lang: language,
        text: confirmText,
        isSuccess: true,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    speakText(confirmText, language);
  };

  return (
    <>
      {/* 1. Floating Launch Terminal Button */}
      <div className="fixed bottom-5 right-5 z-40 select-none">
        <button
          onClick={() => setIsOpen(prev => !prev)}
          className={`flex items-center gap-2.5 px-4 py-3 rounded-full shadow-2xl transition-all cursor-pointer border ${
            isOpen
              ? 'bg-slate-900 text-white border-slate-700 ring-2 ring-sky-400'
              : 'bg-slate-900 hover:bg-slate-800 text-white border-sky-400 shadow-sky-500/25 hover:scale-105'
          }`}
          title="NDRF Citizen Emergency Voice Relay"
        >
          <div className="relative">
            <Radio className="w-5 h-5 text-sky-400" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex flex-col text-left leading-none">
            <span className="text-xs font-black tracking-tight text-white flex items-center gap-1">
              Field Relay
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-sky-500 text-white">
                SOS
              </span>
            </span>
            <span className="text-[10px] text-slate-300 font-medium">
              EN • हिन्दी
            </span>
          </div>
        </button>
      </div>

      {/* 2. Chat Terminal Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[550px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Terminal Header */}
          <div className="bg-slate-900 border-b border-slate-800 p-3.5 text-white flex items-center justify-between gap-2 shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 border border-sky-300/40">
                <Radio className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-white truncate">
                    NDRF Citizen Field Relay
                  </h3>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    24x7
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono truncate">
                  नागरिक आपदा सहायता • Duplex Voice/Text
                </p>
              </div>
            </div>

            {/* Header Controls: Language + Voice + Close */}
            <div className="flex items-center gap-1.5 shrink-0">
              
              {/* Language Switcher */}
              <div className="flex items-center bg-slate-800 rounded-md p-0.5 border border-slate-700 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('en');
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                  }}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    language === 'en' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('hi');
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                  }}
                  className={`px-1.5 py-0.5 rounded cursor-pointer ${
                    language === 'hi' ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  हिन्दी
                </button>
              </div>

              {/* Voice Toggle */}
              <button
                type="button"
                onClick={() => {
                  if (voiceEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
                  setVoiceEnabled(!voiceEnabled);
                }}
                className={`p-1.5 rounded-md border text-xs cursor-pointer transition-colors ${
                  voiceEnabled
                    ? 'bg-slate-800 text-emerald-400 border-slate-700 hover:bg-slate-700'
                    : 'bg-slate-800 text-slate-500 border-slate-700'
                }`}
                title={voiceEnabled ? 'Voice Readback: ON' : 'Voice Readback: OFF'}
              >
                {voiceEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  if (window.speechSynthesis) window.speechSynthesis.cancel();
                  setIsOpen(false);
                }}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

            </div>
          </div>

          {/* Quick Suggestion Chips */}
          <div className="bg-slate-100/80 px-3 py-2 border-b border-slate-200 overflow-x-auto flex gap-1.5 scrollbar-none shrink-0">
            {SUGGESTED_PROMPTS[language].map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(chip.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 hover:border-sky-200 text-[11px] font-semibold transition-all cursor-pointer shadow-2xs"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Message Stream */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 bg-slate-50/50">
            {messages.map((msg) => {
              const isUser = msg.sender === 'user';

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed shadow-2xs ${
                    isUser
                      ? 'bg-sky-500 text-white rounded-tr-none font-medium shadow-xs'
                      : msg.isSuccess
                      ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 rounded-tl-none font-semibold'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                  }`}>
                    
                    {/* Bot Title Header */}
                    {!isUser && msg.title && (
                      <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1 mb-1.5 font-bold text-slate-900 text-[11px]">
                        <span>{msg.title}</span>
                        {msg.urgency === 'Critical' && (
                          <span className="text-[9px] font-mono font-bold uppercase px-1 rounded bg-rose-100 text-rose-700">
                            SOS
                          </span>
                        )}
                      </div>
                    )}

                    <div className="whitespace-pre-line">
                      {msg.text}
                    </div>

                    {/* Interactive Action Card inside Message */}
                    {!isUser && msg.action === 'ticket' && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleDirectTicketCreation(msg.category, msg.defaultLocation, msg.urgency)}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          <PlusCircle className="w-3.5 h-3.5" />
                          <span>
                            {language === 'hi' ? '🚨 1-क्लिक आपातकालीन टिकट दर्ज करें' : '🚨 1-Click Dispatch SOS Ticket'}
                          </span>
                        </button>
                      </div>
                    )}

                    {!isUser && msg.action === 'shelter' && onNavigateView && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => {
                            onNavigateView('shelters');
                            setIsOpen(false);
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-95"
                        >
                          <Home className="w-3.5 h-3.5" />
                          <span>
                            {language === 'hi' ? 'राहत शिविर लाइव बेड देखें' : 'View Evacuation Shelters & Beds'}
                          </span>
                        </button>
                      </div>
                    )}

                  </div>

                  <span className="text-[9px] text-slate-400 mt-1 px-1 font-mono">
                    {msg.time}
                  </span>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Terminal Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={language === 'hi' ? 'संदेश लिखें (उदा: पीने का पानी, शेल्टर, बचाव नाव)...' : 'Type distress message (e.g. water, shelter, rescue boat)...'}
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-400"
            />

            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="px-3.5 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-white text-xs font-bold flex items-center justify-center transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
