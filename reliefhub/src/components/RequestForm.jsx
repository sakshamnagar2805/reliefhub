import React, { useState } from 'react';
import { X, AlertTriangle, Droplets, Utensils, HeartPulse, Home, LifeBuoy, Bot, Cpu, CheckCircle2, RefreshCw } from 'lucide-react';

const CATEGORIES = [
  { name: 'Water', icon: Droplets },
  { name: 'Food', icon: Utensils },
  { name: 'Medicine', icon: HeartPulse },
  { name: 'Shelter', icon: Home },
  { name: 'Rescue', icon: LifeBuoy }
];

const SAMPLE_DISTRESS_TEXTS = [
  {
    label: '🌊 Flood SOS (Hinglish)',
    text: 'गांधी नगर में 8 लोग छत पर फंसे हैं, पीने का पानी खत्म हो गया है और एक बच्चे को बुखार है तुरंत मदद चाहिए'
  },
  {
    label: '🍞 Ration Need (English)',
    text: 'At Subhash Chowk community hall, 25 displaced persons have no meals since yesterday. Water is available.'
  },
  {
    label: '💊 Urgent Medical (Hindi)',
    text: 'सेक्टर A में बुजुर्ग महिला को इंसुलिन और जीवन रक्षक दवाओं की सख्त आवश्यकता है फोन नंबर 98201 10101'
  }
];

export default function RequestForm({ isOpen, onClose, onSubmit }) {
  const [category, setCategory] = useState('Water');
  const [quantity, setQuantity] = useState(10);
  const [urgency, setUrgency] = useState('Critical');
  const [location, setLocation] = useState('');
  const [contact, setContact] = useState('');
  const [details, setDetails] = useState('');
  const [error, setError] = useState('');

  // AI Emergency Analyzer State
  const [rawDistressText, setRawDistressText] = useState('');
  const [analyzerFeedback, setAnalyzerFeedback] = useState(null);
  const [missingInfoFlag, setMissingInfoFlag] = useState('');

  if (!isOpen) return null;

function cleanLoc(loc) {
  if (!loc) return '';
  let str = loc
    .replace(/\b(?:trapped|stranded|stuck|people|peoples|persons|family|house|home|water|flood|patients|members|need|help|please|send)\b/gi, ' ')
    .trim();
  str = str.replace(/^(?:in|at|near|from|around|across|behind|beside|to|of|and|a|an|the)\s+/gi, '').trim();
  return str.replace(/\s+/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Dynamic NLP Extractors for Arbitrary Distress Messages
function extractDynamicLocation(text) {
  if (!text) return '';
  const lower = text.toLowerCase();

  // 1. Canonical sectors / landmarks check
  if (lower.includes('subhash') || lower.includes('सुभाष') || lower.includes('chowk') || lower.includes('चौक')) {
    return 'Sector B — Subhash Chowk';
  }
  if (lower.includes('yamuna') || lower.includes('यमुना') || lower.includes('riverfront') || lower.includes('sector 4') || lower.includes('सेक्टर 4')) {
    return 'Sector 04 — Yamuna Riverfront';
  }
  if (lower.includes('industrial') || lower.includes('उद्योग') || lower.includes('depot') || lower.includes('डिपो')) {
    return 'Sector C — Industrial Area Depot';
  }
  if (lower.includes('gandhi nagar') || lower.includes('गांधी नगर') || lower.includes('gandhinagar') || lower.includes('gandhi')) {
    return 'Sector A — Gandhi Nagar';
  }

  // Normalize phrases like 'trapped in flood in' -> 'in'
  let clean = text.replace(/in\s+(?:a\s+)?(?:flood|water|trouble|danger|emergency)\s+(in|at|near|from)\s+/gi, ' $1 ');

  // 2. Sector pattern: e.g. Sector 15 Rohini, Sector D
  const sectorMatch = clean.match(/\b(Sector\s*[A-Za-z0-9]+(?:\s+[A-Za-z0-9]+)?)\b/i);
  if (sectorMatch) return cleanLoc(sectorMatch[1]);

  // 3. Indian suffix pattern: [Name] + Nagar/Colony/Vihar/Chowk/Lines/Bagh/Ghat/Market/Station etc.
  const suffixMatch = clean.match(/\b([A-Za-z\u0900-\u097F0-9]+(?:\s+[A-Za-z\u0900-\u097F0-9]+)?\s+(?:Nagar|Colony|Vihar|Chowk|Enclave|Road|Marg|Bagh|Ganj|Puri|Bazaar|Ghat|Camp|Lines|Kunj|Pur|Extension|Market|Station|Terminal))\b/i);
  if (suffixMatch) return cleanLoc(suffixMatch[1]);

  // 4. Preposition match: in/at/near/from [place]
  const prepRegex = /\b(?:in|at|near|from)\s+([A-Za-z0-9\s]{3,30}?)(?=\s+(?:please|pls|help|urgently|urgent|immediate|send|having|with|trapped|need|\.|\!|\?|$))/gi;
  const matches = [...clean.matchAll(prepRegex)];
  for (const m of matches) {
    const candidate = cleanLoc(m[1]);
    if (candidate && !candidate.toLowerCase().includes('flood') && candidate.length >= 3) {
      return candidate;
    }
  }

  // 5. Hindi Postposition match: "[स्थान] में / के पास / पर / से"
  const hindiPostRegex = /([\u0900-\u097FA-Za-z0-9\s]{2,30}?)\s*(?:में|के पास|निकट|चौक पर|इलाके में|के सामने)/;
  const hindiMatch = text.match(hindiPostRegex);
  if (hindiMatch) {
    const rawLoc = cleanLoc(hindiMatch[1]);
    if (rawLoc.length >= 3 && !rawLoc.includes('बाढ़') && !rawLoc.includes('लोग')) {
      return rawLoc;
    }
  }

  return '';
}

function extractDynamicHeadcount(text) {
  if (!text) return 10;
  const lower = text.toLowerCase();

  const wordMap = {
    'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
    'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10,
    'eleven': 11, 'twelve': 12, 'fifteen': 15, 'twenty': 20,
    'twenty five': 25, 'thirty': 30, 'forty': 40, 'fifty': 50, 'hundred': 100,
    'एक': 1, 'दो': 2, 'तीन': 3, 'चार': 4, 'पांच': 5, 'पाँच': 5,
    'छह': 6, 'सात': 7, 'आठ': 8, 'नौ': 9, 'दस': 10, 'बीस': 20, 'पचास': 50
  };

  for (const [word, val] of Object.entries(wordMap)) {
    const rx = new RegExp(`\\b${word}\\s+(?:people|peoples|person|persons|citizens|members|family|families|adults|children|kids|patients|log|jan|vyakti|लोग|व्यक्ति|परिवार|मरीज)?\\b`, 'i');
    if (rx.test(lower)) return val;
  }

  const countPattern = /\b(\d+)\s*(?:people|peoples|persons|citizens|members|family|families|adults|children|kids|patients|log|vyakti|parivar|jan|लोग|व्यक्ति|परिवार|मरीज|मरीजों)?\b/i;
  const match = text.match(countPattern);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num > 0 && num < 5000 && String(num).length < 6) return num;
  }

  const anyNum = text.match(/\b(\d{1,4})\b/);
  if (anyNum) {
    const val = parseInt(anyNum[1], 10);
    if (val > 0 && val < 5000 && String(val).length < 5) return val;
  }

  return 5;
}

function extractDynamicCauseAndSituation(text) {
  if (!text) return { cause: 'General Emergency Relief', situation: '' };
  const lower = text.toLowerCase();
  const causes = [];

  if (lower.includes('flood') || lower.includes('waterlogging') || lower.includes('बाढ़') || lower.includes('डूब') || lower.includes('submerged') || lower.includes('water rise') || lower.includes('pani')) {
    causes.push('Flood Inundation & Rising Water');
  }
  if (lower.includes('trap') || lower.includes('strand') || lower.includes('stuck') || lower.includes('roof') || lower.includes('छत') || lower.includes('फंसे') || lower.includes('घिरे') || lower.includes('boat') || lower.includes('नाव') || lower.includes('rescue') || lower.includes('बचाव')) {
    causes.push('Stranded Citizens Trapped (Evacuation Needed)');
  }
  if (lower.includes('collapse') || lower.includes('debris') || lower.includes('rubble') || lower.includes('मलबा') || lower.includes('मकान गिर') || lower.includes('wall collapse')) {
    causes.push('Building Collapse & Debris Entrapment');
  }
  if (lower.includes('fever') || lower.includes('बुखार') || lower.includes('insulin') || lower.includes('इंसुलिन') || lower.includes('medicine') || lower.includes('दवा') || lower.includes('doctor') || lower.includes('डॉक्टर') || lower.includes('bleed') || lower.includes('injur') || lower.includes('चोट') || lower.includes('pregnant') || lower.includes('बीमार')) {
    causes.push('Critical Medical / Life-Support Emergency');
  }
  if (lower.includes('drinking water') || lower.includes('पीने का पानी') || lower.includes('thirsty') || lower.includes('dehydration') || lower.includes('पानी खत्म') || lower.includes('clean water')) {
    causes.push('Potable Drinking Water Shortage');
  }
  if (lower.includes('food') || lower.includes('खाना') || lower.includes('भोजन') || lower.includes('meal') || lower.includes('ration') || lower.includes('राशन') || lower.includes('hungry') || lower.includes('भूखे') || lower.includes('starv')) {
    causes.push('Severe Food & Ration Exhaustion');
  }
  if (lower.includes('shelter') || lower.includes('शेल्टर') || lower.includes('camp') || lower.includes('शिविर') || lower.includes('homeless') || lower.includes('displaced') || lower.includes('बेघर')) {
    causes.push('Displacement & Emergency Shelter Need');
  }

  const primaryCause = causes.length > 0 ? causes.join(' + ') : 'Emergency Distress';
  return { cause: primaryCause, causesList: causes };
}

function extractDynamicCategory(text, causesList) {
  const lower = text.toLowerCase();
  if (
    lower.includes('rescue') || lower.includes('नाव') || lower.includes('boat') ||
    lower.includes('trapped') || lower.includes('stranded') || lower.includes('छत पर') ||
    lower.includes('flood') || lower.includes('बाढ़') || lower.includes('डूब') ||
    lower.includes('collapse') || lower.includes('मकान गिर')
  ) {
    return 'Rescue';
  }
  if (
    lower.includes('medicine') || lower.includes('doctor') || lower.includes('दवा') ||
    lower.includes('insulin') || lower.includes('fever') || lower.includes('बुखार') ||
    lower.includes('injury') || lower.includes('hospital') || lower.includes('डॉक्टर')
  ) {
    return 'Medicine';
  }
  if (
    lower.includes('water') || lower.includes('पानी') || lower.includes('drink') ||
    lower.includes('जल') || lower.includes('thirst') || lower.includes('प्यास')
  ) {
    return 'Water';
  }
  if (
    lower.includes('food') || lower.includes('खाना') || lower.includes('भोजन') ||
    lower.includes('meal') || lower.includes('ration') || lower.includes('राशन') ||
    lower.includes('hungry') || lower.includes('भूख')
  ) {
    return 'Food';
  }
  if (
    lower.includes('shelter') || lower.includes('शेल्टर') || lower.includes('camp') ||
    lower.includes('शिविर') || lower.includes('stay') || lower.includes('bed') || lower.includes('घर')
  ) {
    return 'Shelter';
  }
  return 'Water';
}

function extractDynamicUrgency(text) {
  const lower = text.toLowerCase();
  if (
    lower.includes('urgent') || lower.includes('तुरंत') || lower.includes('critical') ||
    lower.includes('danger') || lower.includes('trapped') || lower.includes('flood') ||
    lower.includes('fever') || lower.includes('insulin') || lower.includes('emergency') ||
    lower.includes('life') || lower.includes('boat') || lower.includes('collapse') ||
    lower.includes('immediately') || lower.includes('बचाव') || lower.includes('sos') ||
    lower.includes('please help') || lower.includes('मदद')
  ) {
    return 'Critical';
  }
  if (
    lower.includes('high') || lower.includes('जल्दी') || lower.includes('fast') ||
    lower.includes('today') || lower.includes('asap')
  ) {
    return 'High';
  }
  return 'Normal';
}

  // AI Dynamic Unstructured SOS Parsing Engine
  const handleAnalyzeDistressText = (textToParse) => {
    const text = (textToParse !== undefined ? textToParse : rawDistressText).trim();
    if (!text) return;

    const count = extractDynamicHeadcount(text);
    const { cause, causesList } = extractDynamicCauseAndSituation(text);
    const cat = extractDynamicCategory(text, causesList);
    const urg = extractDynamicUrgency(text);
    const loc = extractDynamicLocation(text);

    // 1. Set Category & Urgency
    setCategory(cat);
    setUrgency(urg);

    // 2. Set Quantity / Headcount
    setQuantity(count);

    // 3. Set Area / Location
    if (loc) {
      setLocation(loc);
    }

    // 4. Extract Contact Phone Number
    const phoneMatch = text.match(/(?:\+?91[\s-]?)?[6-9]\d{9}\b/);
    if (phoneMatch) {
      setContact(phoneMatch[0]);
    }

    // 5. Build intelligent Situation Context for Details field
    const formattedDetails = `Cause: ${cause} | Area: ${loc || 'Unspecified Area'} | Affected: ${count} people | SOS: ${text}`;
    setDetails(formattedDetails);

    // 6. Clarification / Missing Information Flag
    const missing = [];
    if (!loc) {
      missing.push('⚠️ Area/Location could not be identified — please specify the neighborhood.');
    }
    if (!phoneMatch) {
      missing.push('⚠️ Callback Phone Number is missing from message — please enter a contact number.');
    }
    setMissingInfoFlag(missing.join(' '));

    // 7. Success Feedback Tag
    setAnalyzerFeedback(
      `✓ Auto-Extracted: [${cat}] • ${loc ? `Area: ${loc}` : 'Area needed'} • Cause: ${cause} • Headcount: ${count}`
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const parsedQty = Math.max(1, parseInt(quantity, 10) || 0);

    if (!location.trim()) {
      setError('Please provide a specific location or neighborhood.');
      return;
    }
    if (!contact.trim()) {
      setError('Please enter contact details so dispatchers can reach you.');
      return;
    }
    if (parsedQty <= 0) {
      setError('Quantity must be greater than zero.');
      return;
    }

    const newRequest = {
      id: `REQ-${Date.now()}`,
      category,
      quantity: parsedQty,
      allocatedQuantity: 0,
      details: details.trim() || `${category} emergency assistance required`,
      urgency,
      location: location.trim(),
      contact: contact.trim(),
      status: 'Pending',
      assignedResourceId: null,
      createdAt: new Date().toISOString()
    };

    onSubmit(newRequest);
    // Reset form
    setLocation('');
    setContact('');
    setDetails('');
    setQuantity(10);
    setUrgency('Critical');
    setRawDistressText('');
    setAnalyzerFeedback(null);
    setMissingInfoFlag('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">Request Emergency Relief</h2>
              <p className="text-xs text-slate-500">Your need will be prioritized on the live dispatch grid</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Emergency Analyzer Box */}
        <div className="mt-3.5 bg-slate-900 text-white rounded-xl p-3 border border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>AI Emergency Analyzer (Hindi / English / Hinglish)</span>
            </div>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40">
              NLP Auto-Extract
            </span>
          </div>
          
          <div className="relative">
            <textarea
              rows="2"
              value={rawDistressText}
              onChange={(e) => setRawDistressText(e.target.value)}
              onBlur={() => {
                if (rawDistressText.trim()) handleAnalyzeDistressText();
              }}
              placeholder="Type any random situation, e.g.: 'there is 8 people trapped in a flood in gandhi nagar please help'..."
              className="w-full px-2.5 py-1.5 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-1 focus:ring-sky-400 font-sans"
            />
          </div>

          {/* Explicit Dynamic Analyze Action & Presets */}
          <div className="flex items-center justify-between gap-2 mt-2 flex-wrap">
            <button
              type="button"
              onClick={() => handleAnalyzeDistressText()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold shadow-xs cursor-pointer transition-all active:scale-95"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>⚡ Analyze & Auto-Fill Form</span>
            </button>

            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-semibold">1-Click Test:</span>
              {SAMPLE_DISTRESS_TEXTS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setRawDistressText(sample.text);
                    handleAnalyzeDistressText(sample.text);
                  }}
                  className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 cursor-pointer transition-colors"
                >
                  {sample.label}
                </button>
              ))}
            </div>
          </div>

          {/* Analysis Feedback Notification */}
          {analyzerFeedback && (
            <div className="mt-2 p-1.5 rounded bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="truncate">{analyzerFeedback}</span>
            </div>
          )}

          {/* Missing Information Clarification Flag */}
          {missingInfoFlag && (
            <div className="mt-1.5 p-1.5 rounded bg-amber-950/70 border border-amber-500/40 text-amber-300 text-[11px] flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>{missingInfoFlag}</span>
            </div>
          )}
        </div>

        {error && (
          <div className="mt-3 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-3 space-y-3.5">
          
          {/* Category Chips */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Category of Need *
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {CATEGORIES.map(({ name, icon: Icon }) => (
                <button
                  type="button"
                  key={name}
                  onClick={() => setCategory(name)}
                  className={`flex flex-col items-center justify-center p-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                    category === name
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-xs'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 mb-1" />
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Urgency Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Urgency Level *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setUrgency('Critical')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  urgency === 'Critical'
                    ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-400'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                Critical (Life Risk)
              </button>

              <button
                type="button"
                onClick={() => setUrgency('High')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  urgency === 'High'
                    ? 'border-amber-500 bg-amber-50 text-amber-800 ring-2 ring-amber-400'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                High (&lt; 24h)
              </button>

              <button
                type="button"
                onClick={() => setUrgency('Normal')}
                className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                  urgency === 'Normal'
                    ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-400'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                Normal Relief
              </button>
            </div>
          </div>

          {/* Quantity & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Quantity Units *
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Location / Neighborhood *
              </label>
              <input
                type="text"
                placeholder="e.g. Sector A — Gandhi Nagar"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Contact Phone / Emergency Channel *
            </label>
            <input
              type="text"
              placeholder="e.g. +91 98201 10101"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Specific Needs / Context
            </label>
            <textarea
              rows="2"
              placeholder="e.g. 2 elderly persons needing clean water and blanket"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-md transition-all cursor-pointer"
            >
              Broadcast Need
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
