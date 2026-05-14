import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const translations = {
    en: {
        header: {
          title: 'PharmaVerse',
          goBack: 'Go Back',
        },
        nav: {
          Educational: 'Learn ',
          DoctorsCorner: 'For Doctors ',
          References: 'References ',
        },
        language: {
          select: 'Select language',
        },
        languages: {
            en: 'English',
            hi: 'हिंदी (Hindi)',
            mr: 'मराठी (Marathi)',
        },
        footer: {
          disclaimer: 'Disclaimer: This tool is for informational purposes only and does not constitute medical advice. Consult a healthcare professional for any medical concerns.',
          copyright: ' {year} PharmaVerse. All rights reserved.',
        },
        home: {
            title: 'Your AI-Powered Pharmacy Assistant ',
            mission: 'An expanded suite of specialized tools designed to enhance medication safety and provide evidence-based medical information for everyone.',
            tools: {
                InteractionDetector: { description: 'Check for potential interactions between drugs and herbs.' },
                PrescriptionReader: { description: 'Upload a prescription image to digitize its contents.' },
                SymptomChecker: { description: 'Get an AI analysis of your health symptoms.' },
                PillIdentifier: { description: 'Identify pills by uploading a photo.' },
                DoseCalculator: { description: 'Calculate medication dosages based on patient details.' },
                PharmacistChatbot: { description: 'Chat with an AI pharmacist for quick answers.' },
                LivePharmacist: { description: 'Have a real-time voice conversation with the AI pharmacist.' },
                TextToSpeech: { description: 'Convert text into high-quality spoken audio.' },
                ClinicalTrialFinder: { description: 'Find relevant clinical trials in India.' },
                OtcSafetyGuide: { description: 'Get safety information on over-the-counter drugs.' },
                MedicationGuideGenerator: { description: 'Generate a simple guide for any medication.' }
            }
        },
        pages: {
            InteractionDetector: 'Drug Interaction Checker ',
            PrescriptionReader: 'Smart Prescription Reader ',
            SymptomChecker: 'AI Symptom Checker ',
            PillIdentifier: 'AI Pill Identifier ',
            DoseCalculator: 'AI Dose Calculator ',
            PharmacistChatbot: 'Virtual Pharmacist Chat ',
            LivePharmacist: 'Live Pharmacist Voice Chat ️',
            TextToSpeech: 'TTS Generator ',
            ClinicalTrialFinder: 'Clinical Trial Finder ',
            OtcSafetyGuide: 'OTC Safety Guide ',
            MedicationGuideGenerator: 'Medication Guide Generator ',
        },
        common: {
            loading: 'Loading...',
            error: 'An unexpected error occurred. Please try again.',
            clear: 'Clear',
            sources: 'Sources',
            send: 'Send',
        },
        feedback: {
            buttonLabel: 'Provide Feedback',
            buttonText: 'Feedback',
            modalTitle: 'Submit Feedback',
            modalSubtitle: 'We would love to hear your thoughts, suggestions, or issues!',
            placeholder: 'Type your feedback here...',
            submitButton: 'Submit',
            submitting: 'Submitting...',
            close: 'Close modal',
            thanksTitle: 'Thank You!',
            thanksSubtitle: 'Your feedback has been submitted successfully.',
        },
        interactionChecker: {
            title: 'Comprehensive Interaction Checker ',
            subtitle: 'Check for potential interactions between drugs, herbs, supplements, and food.',
            tabs: {
                drugHerb: 'Drug-Herb',
                drugDrug: 'Drug-Drug',
                drugSupplement: 'Drug-Supplement',
                drugFood: 'Drug-Food',
                polypharmacy: 'Polypharmacy',
            },
            drugLabel: 'Drug Name',
            drugPlaceholder: 'e.g., Atorvastatin',
            herbLabel: 'Herb Name',
            herbPlaceholder: 'e.g., Turmeric',
            drug1Label: 'Drug 1 Name',
            drug1Placeholder: 'e.g., Warfarin',
            drug2Label: 'Drug 2 Name',
            drug2Placeholder: 'e.g., Aspirin',
            supplementLabel: 'Supplement Name',
            supplementPlaceholder: 'e.g., Fish Oil',
            foodLabel: 'Food/Beverage Name',
            foodPlaceholder: 'e.g., Grapefruit Juice',
            polypharmacyLabel: 'Enter a list of drugs (one per line or separated by commas)',
            polypharmacyPlaceholder: 'e.g.,\nMetformin\nLisinopril\nAtorvastatin\n...',
            checking: 'Checking...',
            checkButton: 'Check Interaction',
            validation: {
                bothEmpty: 'Please enter both items to check.',
                item1Empty: 'Please enter the first item.',
                item2Empty: 'Please enter the second item.',
                polypharmacyEmpty: 'Please enter a list of drugs.',
                tooShort: 'Inputs must be at least 3 characters long.',
                invalidChars: 'Please enter valid names. Avoid using only numbers or special characters.'
            },
            examplesTitle: 'Common Interaction Examples ',
            tryExample: 'Try this example',
            noInteractionsFound: 'No significant interactions were found among the provided medications. Always consult a healthcare professional for a comprehensive review.',
            polypharmacyResultsTitle: 'Polypharmacy Interaction Analysis',
            examples: {
              drugHerb: [
                  { input1: "Warfarin", input2: "St. John's Wort", explanation: "St. John's Wort can induce liver enzymes (CYP2C9) that metabolize Warfarin, decreasing its effectiveness and increasing the risk of blood clots." },
                  { input1: "Aspirin", input2: "Ginkgo Biloba", explanation: "Both Aspirin and Ginkgo Biloba have antiplatelet (blood-thinning) effects. Taking them together significantly increases the risk of serious bleeding events." },
              ],
              drugDrug: [
                  { input1: "Lisinopril", input2: "Spironolactone", explanation: "Both drugs can increase potassium levels in the blood. Using them together increases the risk of hyperkalemia, which can cause dangerous heart rhythm problems." },
                  { input1: "Sildenafil", input2: "Nitroglycerin", explanation: "Combining these can cause a sudden and severe drop in blood pressure, which can be life-threatening. This combination is strictly contraindicated." },
              ],
              drugSupplement: [
                  { input1: "Antidepressants (SSRIs)", input2: "5-HTP", explanation: "Both increase serotonin levels. Combining them can lead to serotonin syndrome, a potentially life-threatening condition with symptoms like agitation, rapid heart rate, and high blood pressure." },
                  { input1: "Levothyroxine", input2: "Iron supplements", explanation: "Iron can decrease the absorption of levothyroxine from the gut, making the thyroid medication less effective. They should be taken at least 4 hours apart." },
              ],
              drugFood: [
                  { input1: "Atorvastatin", input2: "Grapefruit Juice", explanation: "Grapefruit juice inhibits an enzyme (CYP3A4) that metabolizes statins, leading to higher drug levels in the blood and increasing the risk of side effects like muscle pain." },
                  { input1: "Warfarin", input2: "Leafy Greens (Vitamin K)", explanation: "Foods rich in Vitamin K, like spinach and kale, can counteract the blood-thinning effect of Warfarin, making it less effective and increasing clot risk. Consistent intake is key." },
              ],
              polypharmacy: [
                  { title: "Cardiovascular & Diabetes Care", drugs: "Metformin\nLisinopril\nAtorvastatin\nAspirin (81mg)", explanation: "A common combination for patients with type 2 diabetes, hypertension, and high cholesterol. This check will look for interactions like blood sugar effects and kidney function monitoring." },
                  { title: "Pain & Blood Thinner Mix", drugs: "Warfarin\nClopidogrel\nIbuprofen", explanation: "This combination includes two blood thinners and an NSAID. It demonstrates a high-risk scenario for gastrointestinal bleeding that requires careful management." },
              ]
            }
        },
        resultCard: {
            category: { Safe: 'Safe to use together', Caution: 'Use with caution', Avoid: 'Avoid using together' },
            summary: 'Clinical Summary', 
            mechanism: 'Mechanism of Interaction', 
            evidenceLevel: 'Level of Evidence', 
            sideEffects: 'Potential Side Effects',
            severity: 'Severity',
            interactionScore: 'Risk Score',
            saferAlternatives: 'Safer Alternatives',
        },
        educational: {
            title: 'Learn About Safe Medication Practices ',
            articles: [
                { title: 'Understanding Your Prescription', content: 'Always follow the dosage instructions provided by your doctor. Never share your medication with others. Store medicines in a cool, dry place away from children.' },
                { title: 'The Danger of Self-Medication', content: 'Self-medicating can lead to incorrect dosage, adverse reactions, or masking a more serious underlying condition. Always consult a healthcare professional before starting any new treatment.' },
            ],
        },
        doctorsCorner: {
            title: 'Resources for Healthcare Professionals ‍️',
            subtitle: 'Access curated, high-quality medical databases and resources.',
            section1Title: 'Professional Databases', section2Title: 'General Health Resources',
        },
        references: {
            title: 'Authoritative Health Resources ',
            subtitle: 'The information provided by our tools is compiled and verified against these reputable sources.',
            visitSite: 'Visit Site',
        },
        prescriptionReader: {
            title: 'Smart Prescription Reader ',
            subtitle: 'Upload a clear image of your prescription to extract the details.',
            uploadButton: 'Click to upload a prescription',
            orDrag: 'or drag and drop an image here',
            analyzing: 'Analyzing prescription...',
            resultsTitle: 'Extracted Prescription Details',
            patient: 'Patient Name',
            doctor: 'Doctor Name',
            date: 'Prescription Date',
            age: 'Age',
            gender: 'Gender',
            clinic: 'Clinic / Hospital',
            doctorRegNo: "Doctor Reg. No.",
            patientInfoTitle: "Patient Information",
            doctorInfoTitle: "Doctor & Clinic Information",
            table: { drug: 'Drug Name', dosage: 'Dosage', frequency: 'Frequency', actions: 'Actions' },
            viewDetails: 'View Details',
            hideDetails: 'Hide Details',
            fetchingDetails: 'Fetching drug details...',
            details: {
                description: 'Description',
                indications: 'Indications',
                sideEffects: 'Common Side Effects',
                relatedDrugs: 'Related Drugs & Alternatives',
                warnings: 'Important Warnings',
            },
            tips: {
                title: 'For Best Results',
                tip1: 'Place the prescription on a flat surface in a well-lit area.',
                tip2: 'Avoid shadows and glare on the paper.',
                tip3: 'Ensure the entire prescription is visible in the photo.',
                tip4: 'Make sure the text is in focus and not blurry.',
            },
            howItWorks: {
                title: 'How Smart Prescription Reader Works',
                steps: [
                    { emoji: '', title: '1. Upload', description: 'Take a clear photo or upload PDF' },
                    { emoji: '', title: '2. OCR Analysis', description: 'Advanced OCR extracts text' },
                    { emoji: '', title: '3. AI Verification', description: 'AI cross-checks with databases' },
                    { emoji: '', title: '4. Detailed Report', description: 'Generate comprehensive report' },
                ]
            },
            errors: {
                safety: "Could not analyze the prescription image due to safety reasons. Please ensure it does not contain sensitive personal information beyond what is necessary.",
                unreadable: "The AI could not read the text on the image. Please try taking a clearer, well-lit photo and upload again."
            },
            verifyTitle: "Please Verify",
            verifyText: "AI extraction can sometimes make mistakes. Please carefully compare the details below with your physical prescription before taking any action.",
            interactionTitle: "Prescription Interaction Analysis",
            checkingInteractions: "Checking for interactions...",
        },
        pillIdentifier: {
            title: 'AI Pill Identifier ',
            subtitle: 'Identify pills by their appearance, name, or packaging.',
            uploadLabel: 'Click to upload a pill image',
            analyzingImage: 'Analyzing image...',
            searching: 'Searching...',
            resultsTitle: 'Pill Identification Result',
            identifyByPill: 'By Pill Image',
            identifyByName: 'By Name',
            identifyByPackage: 'By Package Image',
            drugLabel: 'Drug Name',
            namePlaceholder: 'e.g., Crocin',
            searchButton: 'Search',
            packageUploadLabel: 'Click to upload a package image',
            newSearch: 'New Search',
            examples: {
                title: "Or try an example:",
                name: [
                    { name: "Paracetamol 500mg" },
                    { name: "Ibuprofen 200mg" },
                    { name: "Aspirin 75mg" },
                ]
            }
        },
        doseCalculator: {
            title: 'AI Dose Calculator ️',
            subtitle: 'Enter the details below to calculate the recommended dosage.',
            calculateButton: 'Calculate Dose',
            calculating: 'Calculating...',
            resultsTitle: 'Dosage Calculation Result',
            form: {
                patientTitle: 'Patient Information',
                patientSubtitle: 'Enter patient details for an accurate calculation.',
                ageLabel: 'Enter age (years)',
                agePlaceholder: 'e.g., 35',
                weightLabel: 'Enter weight (kg)',
                weightPlaceholder: 'e.g., 70',
                genderLabel: 'Select gender',
                genders: { male: 'Male', female: 'Female', other: 'Other' },
                drugTitle: 'Drug Selection',
                drugLabel: 'Select drug',
                drugPlaceholder: 'e.g., Paracetamol',
                indicationLabel: 'Select indication',
                indicationPlaceholder: 'e.g., Fever',
                renalLabel: 'Renal Status',
                hepaticLabel: 'Hepatic Status',
                status: { normal: 'Normal', mild: 'Mild Impairment', moderate: 'Moderate Impairment', severe: 'Severe Impairment' }
            },
            results: {
                recommended: 'Recommended Dose',
                max: 'Maximum Safe Dose',
                notes: 'Adjustment Notes',
            }
        },
        symptomChecker: {
            title: 'AI Symptom Checker ',
            subtitle: 'Describe your symptoms to get an AI-powered preliminary analysis.',
            inputLabel: 'Describe your symptoms',
            inputPlaceholder: 'e.g., I have a headache, a fever of 101°F, and a sore throat...',
            analyzeButton: 'Analyze Symptoms',
            analyzing: 'Analyzing...',
            resultsTitle: 'Symptom Analysis Results',
            disclaimerTitle: 'Important Disclaimer',
            nextSteps: 'Suggested Next Steps',
            confidence: { High: "High Confidence", Medium: "Medium Confidence", Low: "Low Confidence" },
            emergencyWarningTitle: "Emergency Warning",
            reasoning: "Reasoning"
        },
        clinicalTrialFinder: {
            title: 'Clinical Trial Finder (India) ',
            subtitle: 'Search for ongoing clinical trials in India based on a condition or drug.',
            searching: 'Searching...',
            searchButton: 'Search',
            noResults: 'No clinical trials found for your query.',
            resultsTitle: 'Clinical Trial Results',
            filters: {
                title: 'Search & Filters',
                subtitle: 'Narrow down trials by your criteria',
                searchPlaceholder: 'Disease, drug, sponsor...',
                allPhases: 'All Phases',
                allLocations: 'All Locations',
                allStatus: 'All Status',
                apply: 'Apply Filters',
                clear: 'Clear Filters'
            }
        },
        otcGuide: {
            title: 'OTC Medicine Safety Guide ',
            subtitle: 'Get a safety guide for any over-the-counter medicine.',
            drugPlaceholder: 'e.g., Ibuprofen',
            gettingGuide: 'Getting guide...',
            getGuideButton: 'Get Guide',
            resultsTitle: 'Safety Guide for',
            results: {
                indications: 'Indications',
                warnings: 'Important Warnings',
                safeDose: 'Safe Dose',
                maxDose: 'Max Dose',
                contraindications: 'Contraindications',
                sideEffects: 'Side Effects',
                interactions: 'Interactions',
            },
            rulesTitle: '5 Golden Rules of OTC Use ',
            rules: [
                { emoji: '', title: 'Read the Label', description: 'Always read all ingredients and directions before taking any OTC medication.' },
                { emoji: '️', title: 'Check Interactions', description: "Verify that OTC medicines won't interact with your prescription medications." },
                { emoji: '', title: 'Follow Dosage', description: 'Never exceed recommended doses. More is not always better and can be dangerous.' },
                { emoji: '⏰', title: 'Time Limits', description: "Don't use OTC medicines longer than recommended. See a doctor if symptoms persist." },
                { emoji: '‍️', title: 'Ask Professionals', description: 'Consult pharmacists or doctors if you have questions or concerns.' },
            ]
        },
        medicationGuide: {
            title: 'Medication Guide Generator ',
            subtitle: 'Generate a simplified, patient-friendly guide for any medication.',
            drugPlaceholder: 'e.g., Atorvastatin',
            generating: 'Generating guide...',
            getGuideButton: 'Generate Guide',
            resultsTitle: 'Patient Guide for',
            results: {
                mechanismOfAction: 'How it Works',
                dosing: 'How to Take It',
                sideEffects: 'Common Side Effects',
                warnings: 'Important Warnings'
            },
            startMessage: 'Enter a drug name above to generate a patient-friendly guide.'
        },
        pharmacistChatbot: {
            title: 'Virtual Pharmacist Chat ‍️',
            subtitle: 'This is for informational purposes only.',
            welcomeMessage: 'Hello! I am your AI Pharmacist. How can I help you with your medication questions today?',
            inputPlaceholder: 'Type your question, or use the mic...',
            recording: 'Recording audio... ',
            transcribing: 'Transcribing audio... ️',
            startRecording: 'Start recording',
            stopRecording: 'Stop recording',
            micError: 'Microphone access denied. Please allow microphone access in your browser settings.',
            transcriptionError: 'Transcription failed. Please try again.',
        },
        livePharmacist: {
            title: 'Live Pharmacist Voice Chat ️',
            subtitle: 'Speak directly with our AI pharmacist for instant answers.',
            start: 'Start Conversation',
            stop: 'End Conversation',
            status: {
                connecting: 'Connecting...',
                connected: 'Connected. You can start speaking now.',
                disconnected: 'Session ended. Click start to talk again.',
                error: 'Connection error. Please try again.'
            },
            you: 'You',
            bot: 'AI Pharmacist'
        },
        ttsGenerator: {
            title: 'Text-to-Speech Generator ',
            subtitle: 'Convert text into high-quality spoken audio.',
            placeholder: 'Enter text here...',
            languageLabel: 'Language for Speech',
            voiceLabel: 'Select a Voice',
            generate: 'Generate Speech',
            generating: 'Generating...',
            statusTranslating: 'Translating text...',
            translatedTextLabel: 'Text being spoken',
            voices: {
                Zephyr: 'Zephyr (Friendly)',
                Puck: 'Puck (Calm)',
                Charon: 'Charon (Deep)',
                Kore: 'Kore (Warm)',
                Fenrir: 'Fenrir (Bright)'
            }
        }
    },
    hi: {
        header: {
            title: 'फार्मावर्स',
            goBack: 'वापस जाएं',
        },
        nav: {
            Educational: 'जानें ',
            DoctorsCorner: 'डॉक्टरों के लिए ',
            References: 'संदर्भ ',
        },
        language: {
            select: 'भाषा चुनें',
        },
        languages: {
            en: 'English',
            hi: 'हिंदी (Hindi)',
            mr: 'मराठी (Marathi)',
        },
        footer: {
            disclaimer: 'अस्वीकरण: यह उपकरण केवल सूचनात्मक उद्देश्यों के लिए है और चिकित्सा सलाह का गठन नहीं करता है। किसी भी चिकित्सा चिंता के लिए एक स्वास्थ्य देखभाल पेशेवर से परामर्श करें।',
            copyright: ' {year} फार्मावर्स। सर्वाधिकार सुरक्षित।',
        },
        home: {
            title: 'आपका एआई-संचालित फार्मेसी सहायक ',
            mission: 'विशेष उपकरणों का एक विस्तारित सूट जो दवा सुरक्षा को बढ़ाने और सभी के लिए साक्ष्य-आधारित चिकित्सा जानकारी प्रदान करने के लिए डिज़ाइन किया गया है।',
            tools: {
                InteractionDetector: { description: 'दवाओं और जड़ी-बूटियों के बीच संभावित इंटरैक्शन की जांच करें।' },
                PrescriptionReader: { description: 'एक पर्चे की छवि को उसकी सामग्री को डिजिटाइज़ करने के लिए अपलोड करें।' },
                SymptomChecker: { description: 'अपने स्वास्थ्य लक्षणों का एआई विश्लेषण प्राप्त करें।' },
                PillIdentifier: { description: 'एक फोटो अपलोड करके गोलियों की पहचान करें।' },
                DoseCalculator: { description: 'रोगी के विवरण के आधार पर दवा की खुराक की गणना करें।' },
                PharmacistChatbot: { description: 'त्वरित उत्तरों के लिए एआई फार्मासिस्ट के साथ चैट करें।' },
                LivePharmacist: { description: 'एआई फार्मासिस्ट के साथ रीयल-टाइम वॉयस वार्तालाप करें।' },
                TextToSpeech: { description: 'टेक्स्ट को उच्च-गुणवत्ता वाली बोली जाने वाली ऑडियो में बदलें।' },
                ClinicalTrialFinder: { description: 'भारत में प्रासंगिक क्लिनिकल परीक्षण खोजें।' },
                OtcSafetyGuide: { description: 'ओवर-द-काउंटर दवाओं पर सुरक्षा जानकारी प्राप्त करें।' },
            },
        },
        pages: {
            InteractionDetector: 'ड्रग इंटरेक्शन चेकर ',
            PrescriptionReader: 'स्मार्ट प्रिस्क्रिप्शन रीडर ',
            SymptomChecker: 'एआई लक्षण चेकर ',
            PillIdentifier: 'एआई गोली पहचानकर्ता ',
            DoseCalculator: 'एआई खुराक कैलकुलेटर ',
            PharmacistChatbot: 'वर्चुअल फार्मासिस्ट चैट ',
            LivePharmacist: 'लाइव फार्मासिस्ट वॉयस चैट ️',
            TextToSpeech: 'टीटीएस जेनरेटर ',
            ClinicalTrialFinder: 'क्लिनिकल ट्रायल फाइंडर ',
            OtcSafetyGuide: 'ओटीसी सुरक्षा गाइड ',
        },
        common: {
            loading: 'लोड हो रहा है...',
            error: 'एक अप्रत्याशित त्रुटि हुई। कृपया पुन: प्रयास करें।',
            clear: 'साफ़ करें',
            sources: 'स्रोत',
            send: 'भेजें',
        },
        feedback: {
            buttonLabel: 'प्रतिक्रिया प्रदान करें',
            buttonText: 'प्रतिक्रिया',
            modalTitle: 'प्रतिक्रिया सबमिट करें',
            modalSubtitle: 'हमें आपके विचार, सुझाव या समस्याएं सुनना अच्छा लगेगा!',
            placeholder: 'अपनी प्रतिक्रिया यहां टाइप करें...',
            submitButton: 'सबमिट करें',
            submitting: 'सबमिट हो रहा है...',
            close: 'मोडल बंद करें',
            thanksTitle: 'धन्यवाद!',
            thanksSubtitle: 'आपकी प्रतिक्रिया सफलतापूर्वक सबमिट कर दी गई है।',
        },
        interactionChecker: {
            title: 'व्यापक इंटरेक्शन चेकर ',
            subtitle: 'दवाओं, जड़ी-बूटियों, सप्लीमेंट्स और भोजन के बीच संभावित इंटरैक्शन की जांच करें।',
            tabs: {
                drugHerb: 'दवा-जड़ी-बूटी',
                drugDrug: 'दवा-दवा',
                drugSupplement: 'दवा-सप्लीमेंट',
                drugFood: 'दवा-भोजन',
                polypharmacy: 'पॉलीफार्मेसी',
            },
            drugLabel: 'दवा का नाम',
            drugPlaceholder: 'उदा., एटोरवास्टेटिन',
            herbLabel: 'जड़ी-बूटी का नाम',
            herbPlaceholder: 'उदा., हल्दी',
            drug1Label: 'दवा 1 का नाम',
            drug1Placeholder: 'उदा., वॉर्फरिन',
            drug2Label: 'दवा 2 का नाम',
            drug2Placeholder: 'उदा., एस्पिरिन',
            supplementLabel: 'सप्लीमेंट का नाम',
            supplementPlaceholder: 'उदा., मछली का तेल',
            foodLabel: 'भोजन/पेय का नाम',
            foodPlaceholder: 'उदा., अंगूर का रस',
            polypharmacyLabel: 'दवाओं की सूची दर्ज करें (प्रति पंक्ति एक या अल्पविराम से अलग)',
            polypharmacyPlaceholder: 'उदा.,\nमेटफॉर्मिन\nलिसिनोप्रिल\nएटोरवास्टेटिन\n...',
            checking: 'जाँच हो रही है...',
            checkButton: 'इंटरेक्शन जांचें',
            validation: {
                bothEmpty: 'जांच के लिए कृपया दोनों आइटम दर्ज करें।',
                item1Empty: 'कृपया पहला आइटम दर्ज करें।',
                item2Empty: 'कृपया दूसरा आइटम दर्ज करें।',
                polypharmacyEmpty: 'कृपया दवाओं की सूची दर्ज करें।',
                invalidChars: 'कृपया मान्य नाम दर्ज करें। केवल संख्या या विशेष वर्णों का उपयोग करने से बचें।'
            },
            examplesTitle: 'आम इंटरेक्शन के उदाहरण ',
            tryExample: 'यह उदाहरण आज़माएं',
            noInteractionsFound: 'दी गई दवाओं के बीच कोई महत्वपूर्ण इंटरेक्शन नहीं मिला। एक व्यापक समीक्षा के लिए हमेशा एक स्वास्थ्य देखभाल पेशेवर से परामर्श करें।',
            polypharmacyResultsTitle: 'पॉलीफार्मेसी इंटरेक्शन विश्लेषण',
            examples: {
                drugHerb: [
                    { input1: "वॉर्फरिन", input2: "सेंट जॉन पौधा", explanation: "सेंट जॉन पौधा लिवर एंजाइम (CYP2C9) को प्रेरित कर सकता है जो वॉर्फरिन को मेटाबोलाइज़ करता है, जिससे इसकी प्रभावशीलता कम हो जाती है और रक्त के थक्कों का खतरा बढ़ जाता है।" },
                    { input1: "एस्पिरिन", input2: "जिन्कगो बिलोबा", explanation: "एस्पिरिन और जिन्कगो बिलोबा दोनों में एंटीप्लेटलेट (रक्त को पतला करने वाले) प्रभाव होते हैं। इन्हें एक साथ लेने से गंभीर रक्तस्राव की घटनाओं का खतरा काफी बढ़ जाता है।" },
                    { input1: "डिगॉक्सिन", input2: "जिनसेंग", explanation: "जिनसेंग डिगॉक्सिन के स्तर को बढ़ा सकता है, जिससे विषाक्तता का खतरा बढ़ जाता है, जिससे मतली, दृष्टि में परिवर्तन और अनियमित हृदय ताल हो सकती है।" },
                    { input1: "एटोरवास्टेटिन", input2: "रेड यीस्ट राइस", explanation: "रेड यीस्ट राइस में मोनाकोलिन K होता है, जो रासायनिक रूप से लोवास्टैटिन के समान है। इसे एटोरवास्टेटिन जैसे दूसरे स्टैटिन के साथ मिलाने से मांसपेशियों की क्षति (मायोपैथी) का खतरा बढ़ जाता है।" }
                ],
                drugDrug: [
                    { input1: "लिसिनोप्रिल", input2: "स्पिरोनोलैक्टोन", explanation: "दोनों दवाएं रक्त में पोटेशियम के स्तर को बढ़ा सकती हैं। उन्हें एक साथ उपयोग करने से हाइपरकलेमिया का खतरा बढ़ जाता है, जिससे खतरनाक हृदय ताल समस्याएं हो सकती हैं।" },
                    { input1: "सिल्डेनाफिल", input2: "नाइट्रोग्लिसरीन", explanation: "इन्हें मिलाने से रक्तचाप में अचानक और गंभीर गिरावट आ सकती है, जो जानलेवा हो सकती है। यह संयोजन सख्त वर्जित है।" },
                    { input1: "फ्लुओक्सेटीन", input2: "ट्रामाडोल", explanation: "दोनों दवाएं मस्तिष्क में सेरोटोनिन के स्तर को बढ़ाती हैं। उन्हें एक साथ उपयोग करने से सेरोटोनिन सिंड्रोम का खतरा बढ़ जाता है, जो एक संभावित घातक स्थिति है।" },
                    { input1: "क्लोपिडोग्रेल", input2: "ओमेप्राज़ोल", explanation: "ओमेप्राज़ोल क्लोपिडोग्रेल को उसके सक्रिय रूप में परिवर्तित करने की यकृत की क्षमता को कम कर सकता है, जिससे संभावित रूप से इसका एंटीप्लेटलेट प्रभाव कम हो जाता है और दिल का दौरा या स्ट्रोक का खतरा बढ़ जाता है।" }
                ],
                drugSupplement: [
                    { input1: "एंटीडिप्रेसेंट (SSRIs)", input2: "5-HTP", explanation: "दोनों सेरोटोनिन के स्तर को बढ़ाते हैं। उन्हें मिलाने से सेरोटोनिन सिंड्रोम हो सकता है, जो एक संभावित जीवन-धमकाने वाली स्थिति है जिसके लक्षण आंदोलन, तेज हृदय गति और उच्च रक्तचाप हैं।" },
                    { input1: "लेवोथायरोक्सिन", input2: "आयरन सप्लीमेंट्स", explanation: "आयरन आंत से लेवोथायरोक्सिन के अवशोषण को कम कर सकता है, जिससे थायराइड की दवा कम प्रभावी हो जाती है। उन्हें कम से कम 4 घंटे के अंतराल पर लिया जाना चाहिए।" },
                    { input1: "वॉर्फरिन", input2: "विटामिन E", explanation: "विटामिन E की उच्च खुराक वॉर्फरिन के रक्त-पतला करने वाले प्रभावों को बढ़ा सकती है, जिससे महत्वपूर्ण रक्तस्राव का खतरा बढ़ जाता है। करीबी निगरानी की आवश्यकता है।" },
                    { input1: "मेटफॉर्मिन", input2: "क्रोमियम", explanation: "क्रोमियम इंसुलिन और मेटफॉर्मिन जैसी अन्य मधुमेह दवाओं के प्रभाव को बढ़ा सकता है, जिससे हाइपोग्लाइसीमिया (कम रक्त शर्करा) का खतरा बढ़ जाता है।" }
                ],
                drugFood: [
                    { input1: "एटोरवास्टेटिन", input2: "अंगूर का रस", explanation: "अंगूर का रस एक एंजाइम (CYP3A4) को रोकता है जो स्टैटिन को मेटाबोलाइज़ करता है, जिससे रक्त में दवा का स्तर बढ़ जाता है और मांसपेशियों में दर्द जैसे दुष्प्रभावों का खतरा बढ़ जाता है।" },
                    { input1: "वॉर्फरिन", input2: "पत्तेदार साग (विटामिन K)", explanation: "विटामिन K से भरपूर खाद्य पदार्थ, जैसे पालक और केल, वॉर्फरिन के रक्त-पतला करने वाले प्रभाव का प्रतिकार कर सकते हैं, जिससे यह कम प्रभावी हो जाता है और थक्के का खतरा बढ़ जाता है। सुसंगत सेवन महत्वपूर्ण है।" },
                    { input1: "टेट्रासाइक्लिन", input2: "दूध", explanation: "डेयरी उत्पादों में कैल्शियम टेट्रासाइक्लिन से जुड़ जाता है, इसके अवशोषण को रोकता है और एक एंटीबायोटिक के रूप में इसकी प्रभावशीलता को कम करता है। इसे डेयरी से 1 घंटा पहले या 2 घंटे बाद लें।" },
                    { input1: "एलेंड्रोनेट", input2: "कॉफी", explanation: "कॉफी और अन्य पेय पदार्थ एलेंड्रोनेट जैसे बिसफ़ॉस्फ़ोनेट्स के अवशोषण को 50% से अधिक कम कर सकते हैं। इसे केवल सादे पानी के साथ लिया जाना चाहिए।" }
                ],
                polypharmacy: [
                  { title: "हृदय और मधुमेह की देखभाल", drugs: "मेटफॉर्मिन\nलिसिनोप्रिल\nएटोरवास्टेटिन\nएस्पिरिन (81mg)", explanation: "टाइप 2 मधुमेह, उच्च रक्तचाप और उच्च कोलेस्ट्रॉल वाले रोगियों के लिए एक सामान्य संयोजन। यह जांच रक्त शर्करा प्रभाव और गुर्दे की कार्यप्रणाली की निगरानी जैसे इंटरैक्शन की तलाश करेगी।" },
                  { title: "दर्द और रक्त पतला करने वाली दवाओं का मिश्रण", drugs: "वॉर्फरिन\nक्लोपिडोग्रेल\nइबुप्रोफेन", explanation: "इस संयोजन में दो रक्त पतले करने वाली दवाएं और एक NSAID शामिल है। यह गैस्ट्रोइंटेस्टाइनल रक्तस्राव के लिए एक उच्च जोखिम वाली स्थिति को दर्शाता है जिसके लिए सावधानीपूर्वक प्रबंधन की आवश्यकता होती है।" },
                  { title: "मानसिक स्वास्थ्य संयोजन", drugs: "फ्लुओक्सेटीन\nलोराज़ेपाम\nएमिट्रिप्टिलाइन", explanation: "एक SSRI, एक बेंजोडायजेपाइन, और एक ट्राइसाइक्लिक एंटीडिप्रेसेंट को मिलाने से सेरोटोनिन सिंड्रोम और अत्यधिक बेहोशी का खतरा बढ़ सकता है। यह जांच महत्वपूर्ण CNS इंटरैक्शन पर प्रकाश डालती है।" }
                ]
            }
        },
        resultCard: {
            category: { Safe: 'एक साथ उपयोग करने के लिए सुरक्षित', Caution: 'सावधानी के साथ प्रयोग करें', Avoid: 'एक साथ उपयोग करने से बचें' },
            summary: 'नैदानिक सारांश', 
            mechanism: 'इंटरेक्शन का तंत्र', 
            evidenceLevel: 'साक्ष्य का स्तर', 
            sideEffects: 'संभावित दुष्प्रभाव',
            severity: 'गंभीरता',
            interactionScore: 'जोखिम स्कोर',
            saferAlternatives: 'सुरक्षित विकल्प',
        },
        educational: {
            title: 'सुरक्षित दवा प्रथाओं के बारे में जानें ',
            articles: [
                { title: 'अपने पर्चे को समझना', content: 'हमेशा अपने डॉक्टर द्वारा दिए गए खुराक के निर्देशों का पालन करें। अपनी दवा कभी दूसरों के साथ साझा न करें। दवाओं को बच्चों से दूर ठंडी, सूखी जगह पर रखें।' },
                { title: 'स्व-दवा का खतरा', content: 'स्व-दवा से गलत खुराक, प्रतिकूल प्रतिक्रियाएं हो सकती हैं, या एक अधिक गंभीर अंतर्निहित स्थिति छिप सकती है। कोई भी नया उपचार शुरू करने से पहले हमेशा एक स्वास्थ्य देखभाल पेशेवर से परामर्श करें।' },
                { title: 'हर्बल सप्लीमेंट्स और आधुनिक चिकित्सा', content: 'हालांकि कई जड़ी-बूटियों में औषधीय गुण होते हैं, लेकिन वे पर्चे वाली दवाओं के साथ परस्पर क्रिया कर सकती हैं। आपके द्वारा लिए जा रहे सभी सप्लीमेंट्स के बारे में अपने डॉक्टर को सूचित करना महत्वपूर्ण है।' },
            ],
        },
        doctorsCorner: {
            title: 'स्वास्थ्य पेशेवरों के लिए संसाधन ‍️',
            subtitle: 'क्यूरेटेड, उच्च-गुणवत्ता वाले मेडिकल डेटाबेस और संसाधनों तक पहुँचें।',
            section1Title: 'पेशेवर डेटाबेस', section2Title: 'सामान्य स्वास्थ्य संसाधन',
        },
        references: {
            title: 'आधिकारिक स्वास्थ्य संसाधन ',
            subtitle: 'हमारे उपकरणों द्वारा प्रदान की गई जानकारी इन प्रतिष्ठित स्रोतों से संकलित और सत्यापित है।',
            visitSite: 'साइट पर जाएं',
        },
        prescriptionReader: {
            title: 'स्मार्ट प्रिस्क्रिप्शन रीडर ',
            subtitle: 'विवरण निकालने के लिए अपने पर्चे की एक स्पष्ट छवि अपलोड करें।',
            uploadButton: 'एक पर्चे को अपलोड करने के लिए क्लिक करें',
            orDrag: 'या यहां एक छवि खींचें और छोड़ें',
            analyzing: 'पर्चे का विश्लेषण किया जा रहा है...',
            resultsTitle: 'निकाले गए पर्चे का विवरण',
            patient: 'रोगी का नाम',
            doctor: 'डॉक्टर का नाम',
            date: 'पर्चे की तारीख',
            age: 'आयु',
            gender: 'लिंग',
            clinic: 'क्लिनिक / अस्पताल',
            doctorRegNo: "डॉक्टर पंजीकरण संख्या",
            patientInfoTitle: "रोगी की जानकारी",
            doctorInfoTitle: "डॉक्टर और क्लिनिक की जानकारी",
            table: {
                drug: 'दवा का नाम',
                dosage: 'खुराक',
                frequency: 'आवृत्ति',
                actions: 'कार्रवाई',
            },
            viewDetails: 'विवरण देखें',
            hideDetails: 'विवरण छिपाएं',
            fetchingDetails: 'दवा का विवरण प्राप्त हो रहा है...',
            details: {
                description: 'विवरण',
                indications: 'संकेत',
                sideEffects: 'आम दुष्प्रभाव',
                relatedDrugs: 'संबंधित दवाएं और विकल्प',
                warnings: 'महत्वपूर्ण चेतावनियाँ',
            },
            tips: {
                title: 'सर्वोत्तम परिणामों के लिए',
                tip1: 'पर्चे को अच्छी रोशनी वाली समतल सतह पर रखें।',
                tip2: 'कागज पर छाया और चमक से बचें।',
                tip3: 'सुनिश्चित करें कि पूरा पर्चा फोटो में दिखाई दे।',
                tip4: 'सुनिश्चित करें कि पाठ फोकस में है और धुंधला नहीं है।',
            },
            howItWorks: {
                title: 'स्मार्ट प्रिस्क्रिप्शन रीडर कैसे काम करता है',
                steps: [
                    { emoji: '', title: '1. अपलोड करें', description: 'अपने पर्चे का एक स्पष्ट फोटो लें या पीडीएफ अपलोड करें' },
                    { emoji: '', title: '2. ओसीआर विश्लेषण', description: 'उन्नत ओसीआर हस्तलिखित पर्चों से पाठ निकालता है' },
                    { emoji: '', title: '3. एआई सत्यापन', description: 'एआई भारतीय फार्माकोपिया डेटाबेस के साथ क्रॉस-चेक करता है' },
                    { emoji: '', title: '4. विस्तृत रिपोर्ट', description: 'व्यापक दवा सुरक्षा रिपोर्ट उत्पन्न करें' },
                ]
            },
            errors: {
                safety: "सुरक्षा कारणों से पर्चे की छवि का विश्लेषण नहीं किया जा सका। कृपया सुनिश्चित करें कि इसमें आवश्यक से परे संवेदनशील व्यक्तिगत जानकारी शामिल नहीं है।",
                unreadable: "एआई के लिए छवि पर पाठ पढ़ना संभव नहीं है। कृपया एक स्पष्ट, अच्छी रोशनी वाली तस्वीर लेने और फिर से अपलोड करने का प्रयास करें।"
            },
            verifyTitle: "कृपया सत्यापित करें",
            verifyText: "एआई निष्कर्षण कभी-कभी गलतियाँ कर सकता है। कृपया कोई भी कार्रवाई करने से पहले नीचे दिए गए विवरणों की अपने भौतिक पर्चे से सावधानीपूर्वक तुलना करें।",
            interactionTitle: "पर्चे की इंटरेक्शन विश्लेषण",
            checkingInteractions: "इंटरेक्शन की जाँच हो रही है...",
        },
        pillIdentifier: {
            title: 'एआई गोली पहचानकर्ता ',
            subtitle: 'गोलियों को उनकी उपस्थिति, नाम या पैकेजिंग से पहचानें।',
            uploadLabel: 'एक गोली की छवि अपलोड करने के लिए क्लिक करें',
            analyzingImage: 'छवि का विश्लेषण हो रहा है...',
            searching: 'खोज हो रही है...',
            resultsTitle: 'गोली पहचान परिणाम',
            identifyByPill: 'गोली की छवि से',
            identifyByName: 'नाम से',
            identifyByPackage: 'पैकेज की छवि से',
            drugLabel: 'दवा का नाम',
            namePlaceholder: 'उदा., क्रोसिन',
            searchButton: 'खोजें',
            packageUploadLabel: 'पैकेज की छवि अपलोड करने के लिए क्लिक करें',
            newSearch: 'नई खोज',
            examples: {
                title: "या एक उदाहरण आज़माएँ:",
                name: [
                    { name: "पैरासिटामोल 500mg" },
                    { name: "इबुप्रोफेन 200mg" },
                    { name: "एस्पिरिन 75mg" },
                    { name: "एटोरवास्टेटिन 10mg" },
                    { name: "मेटफॉर्मिन 500mg" },
                    { name: "एमोक्सिसिलिन 250mg" }
                ]
            }
        },
        doseCalculator: {
            title: 'एआई खुराक कैलकुलेटर ️',
            subtitle: 'अनुशंसित खुराक की गणना के लिए नीचे विवरण दर्ज करें।',
            calculateButton: 'खुराक की गणना करें',
            calculating: 'गणना हो रही है...',
            resultsTitle: 'खुराक गणना परिणाम',
            form: {
                patientTitle: 'रोगी की जानकारी',
                patientSubtitle: 'एक सटीक गणना के लिए रोगी का विवरण दर्ज करें।',
                ageLabel: 'आयु दर्ज करें (वर्ष)',
                agePlaceholder: 'उदा., 35',
                weightLabel: 'वजन दर्ज करें (किग्रा)',
                weightPlaceholder: 'उदा., 70',
                genderLabel: 'लिंग चुनें',
                genders: { male: 'पुरुष', female: 'महिला', other: 'अन्य' },
                drugTitle: 'दवा का चयन',
                drugLabel: 'दवा चुनें',
                drugPlaceholder: 'उदा., पैरासिटामोल',
                indicationLabel: 'संकेत चुनें',
                indicationPlaceholder: 'उदा., बुखार',
                renalLabel: 'गुर्दे की स्थिति',
                hepaticLabel: 'यकृत की स्थिति',
                status: { normal: 'सामान्य', mild: 'हल्की हानि', moderate: 'मध्यम हानि', severe: 'गंभीर हानि' }
            },
            results: {
                recommended: 'अनुशंसित खुराक',
                max: 'अधिकतम सुरक्षित खुराक',
                notes: 'समायोजन नोट्स',
            }
        },
        symptomChecker: {
            title: 'एआई लक्षण चेकर ',
            subtitle: 'एआई-संचालित प्रारंभिक विश्लेषण प्राप्त करने के लिए अपने लक्षणों का वर्णन करें।',
            inputLabel: 'अपने लक्षणों का वर्णन करें',
            inputPlaceholder: 'उदा., मुझे सिरदर्द, 101°F बुखार, और गले में खराश है...',
            analyzeButton: 'लक्षणों का विश्लेषण करें',
            analyzing: 'विश्लेषण हो रहा है...',
            resultsTitle: 'लक्षण विश्लेषण परिणाम',
            disclaimerTitle: 'महत्वपूर्ण अस्वीकरण',
            nextSteps: 'सुझाए गए अगले कदम',
            confidence: {
                High: "उच्च विश्वास",
                Medium: "मध्यम विश्वास",
                Low: "कम विश्वास"
            },
            emergencyWarningTitle: "आपातकालीन चेतावनी",
            reasoning: "तर्क"
        },
        clinicalTrialFinder: {
            title: 'क्लिनिकल ट्रायल फाइंडर (भारत) ',
            subtitle: 'एक स्थिति या दवा के आधार पर भारत में चल रहे क्लिनिकल परीक्षणों की खोज करें।',
            searching: 'खोज हो रही है...',
            searchButton: 'खोजें',
            noResults: 'आपकी क्वेरी के लिए कोई क्लिनिकल परीक्षण नहीं मिला।',
            resultsTitle: 'क्लिनिकल परीक्षण परिणाम',
            filters: {
                title: 'खोज और फ़िल्टर',
                subtitle: 'अपने मानदंडों के अनुसार परीक्षणों को संक्षिप्त करें',
                searchPlaceholder: 'बीमारी, दवा, प्रायोजक...',
                allPhases: 'सभी चरण',
                allLocations: 'सभी स्थान',
                allStatus: 'सभी स्थितियाँ',
                apply: 'फ़िल्टर लागू करें',
                clear: 'फ़िल्टर साफ़ करें'
            }
        },
        otcGuide: {
            title: 'ओटीसी दवा सुरक्षा गाइड ',
            subtitle: 'किसी भी ओवर-द-काउंटर दवा के लिए एक सुरक्षा गाइड प्राप्त करें।',
            drugPlaceholder: 'उदा., इबुप्रोफेन',
            gettingGuide: 'गाइड प्राप्त हो रहा है...',
            getGuideButton: 'गाइड प्राप्त करें',
            resultsTitle: 'के लिए सुरक्षा गाइड',
            results: {
                indications: 'संकेत',
                warnings: 'महत्वपूर्ण चेतावनियाँ',
                safeDose: 'सुरक्षित खुराक',
                maxDose: 'अधिकतम खुराक',
                contraindications: 'निषेध',
                sideEffects: 'दुष्प्रभाव',
                interactions: 'इंटरेक्शन'
            },
            rulesTitle: 'ओटीसी उपयोग के 5 सुनहरे नियम ',
            rules: [
                { emoji: '', title: 'लेबल पढ़ें', description: 'कोई भी ओटीसी दवा लेने से पहले हमेशा सभी सामग्री और निर्देश पढ़ें।' },
                { emoji: '️', title: 'इंटरेक्शन जांचें', description: 'सत्यापित करें कि ओटीसी दवाएं आपकी पर्चे वाली दवाओं के साथ परस्पर क्रिया नहीं करेंगी।' },
                { emoji: '', title: 'खुराक का पालन करें', description: 'कभी भी अनुशंसित खुराक से अधिक न लें। अधिक हमेशा बेहतर नहीं होता और खतरनाक हो सकता है।' },
                { emoji: '⏰', title: 'समय सीमा', description: 'अनुशंसित से अधिक समय तक ओटीसी दवाओं का उपयोग न करें। यदि लक्षण बने रहते हैं तो डॉक्टर से मिलें।' },
                { emoji: '‍️', title: 'पेशेवरों से पूछें', description: 'यदि आपके कोई प्रश्न या चिंताएं हैं तो फार्मासिस्ट या डॉक्टरों से परामर्श करें।' },
            ]
        },
        pharmacistChatbot: {
            title: 'वर्चुअल फार्मासिस्ट चैट ‍️',
            subtitle: 'यह केवल सूचनात्मक उद्देश्यों के लिए है।',
            welcomeMessage: 'नमस्ते! मैं आपका एआई फार्मासिस्ट हूं। मैं आज आपके दवा संबंधी सवालों में कैसे मदद कर सकता हूं?',
            inputPlaceholder: 'अपना प्रश्न यहाँ लिखें, या माइक का उपयोग करें...',
            recording: 'ऑडियो रिकॉर्ड हो रहा है... ',
            transcribing: 'ऑडियो का प्रतिलेखन किया जा रहा है... ️',
            startRecording: 'रिकॉर्डिंग शुरू करें',
            stopRecording: 'रिकॉर्डिंग बंद करें',
            micError: 'माइक्रोफ़ोन एक्सेस अस्वीकृत। कृपया अपनी ब्राउज़र सेटिंग्स में माइक्रोफ़ोन एक्सेस की अनुमति दें।',
            transcriptionError: 'प्रतिलेखन विफल। कृपया पुन: प्रयास करें।',
        },
        livePharmacist: {
            title: 'लाइव फार्मासिस्ट वॉयस चैट ️',
            subtitle: 'तुरंत जवाब पाने के लिए सीधे हमारे एआई फार्मासिस्ट से बात करें।',
            start: 'बातचीत शुरू करें',
            stop: 'बातचीत समाप्त करें',
            status: {
                connecting: 'कनेक्ट हो रहा है...',
                connected: 'कनेक्ट हो गया। अब आप बोलना शुरू कर सकते हैं।',
                disconnected: 'सत्र समाप्त। फिर से बात करने के लिए स्टार्ट पर क्लिक करें।',
                error: 'कनेक्शन त्रुटि। कृपया पुन: प्रयास करें।'
            },
            you: 'आप',
            bot: 'एआई फार्मासिस्ट'
        },
        ttsGenerator: {
            title: 'टेक्स्ट-टू-स्पीच जेनरेटर ',
            subtitle: 'टेक्स्ट को उच्च-गुणवत्ता वाली बोली जाने वाली ऑडियो में बदलें।',
            placeholder: 'यहां टेक्स्ट दर्ज करें...',
            voiceLabel: 'एक आवाज़ चुनें',
            generate: 'भाषण उत्पन्न करें',
            generating: 'उत्पन्न हो रहा है...',
            voices: {
                Zephyr: 'ज़ेफिर (अनुकूल)',
                Puck: 'पक (शांत)',
                Charon: 'कैरन (गहरा)',
                Kore: 'कोर (गर्म)',
                Fenrir: 'फेनरिर (उज्ज्वल)'
            }
        }
    },
    mr: {
        header: {
            title: 'फार्मावर्स',
            goBack: 'मागे जा',
        },
        nav: {
            Educational: 'शिका ',
            DoctorsCorner: 'डॉक्टरांसाठी ',
            References: 'संदर्भ ',
        },
        language: {
            select: 'भाषा निवडा',
        },
        languages: {
            en: 'English',
            hi: 'हिंदी (Hindi)',
            mr: 'मराठी (Marathi)',
        },
        footer: {
            disclaimer: 'अस्वीकरण: हे साधन केवळ माहितीच्या उद्देशाने आहे आणि वैद्यकीय सल्ला नाही. कोणत्याही वैद्यकीय समस्यांसाठी आरोग्यसेवा व्यावसायिकांचा सल्ला घ्या.',
            copyright: ' {year} फार्मावर्स. सर्व हक्क राखीव.',
        },
        home: {
            title: 'तुमचा एआय-चालित फार्मसी सहाय्यक ',
            mission: 'औषध सुरक्षा वाढविण्यासाठी आणि सर्वांसाठी पुरावा-आधारित वैद्यकीय माहिती प्रदान करण्यासाठी डिझाइन केलेली विशेष साधनांचा विस्तारित संच.',
            tools: {
                InteractionDetector: { description: 'औषधे आणि औषधी वनस्पतींमधील संभाव्य परस्परसंवादांची तपासणी करा.' },
                PrescriptionReader: { description: 'प्रिस्क्रिप्शनची सामग्री डिजिटाइझ करण्यासाठी त्याची प्रतिमा अपलोड करा.' },
                SymptomChecker: { description: 'तुमच्या आरोग्य लक्षणांचे एआय विश्लेषण मिळवा.' },
                PillIdentifier: { description: 'फोटो अपलोड करून गोळ्या ओळखा.' },
                DoseCalculator: { description: 'रुग्णाच्या तपशिलावर आधारित औषधांच्या डोसची गणना करा.' },
                PharmacistChatbot: { description: 'त्वरित उत्तरांसाठी एआय फार्मासिस्टशी चॅट करा.' },
                LivePharmacist: { description: 'एआय फार्मासिस्टसोबत रिअल-टाइम व्हॉइस संभाषण करा.' },
                TextToSpeech: { description: 'मजकूराचे उच्च-गुणवत्तेच्या बोललेल्या ऑडिओमध्ये रूपांतर करा.' },
                ClinicalTrialFinder: { description: 'भारतातील संबंधित क्लिनिकल चाचण्या शोधा.' },
                OtcSafetyGuide: { description: 'ओव्हर-द-काउंटर औषधांवर सुरक्षितता माहिती मिळवा.' },
            },
        },
        pages: {
            InteractionDetector: 'ड्रग इंटरॅक्शन चेकर ',
            PrescriptionReader: 'स्मार्ट प्रिस्क्रिप्शन रीडर ',
            SymptomChecker: 'एआय लक्षण तपासक ',
            PillIdentifier: 'एआय गोळी ओळखकर्ता ',
            DoseCalculator: 'एआय डोस कॅल्क्युलेटर ',
            PharmacistChatbot: 'व्हर्च्युअल फार्मासिस्ट चॅट ',
            LivePharmacist: 'लाइव्ह फार्मासिस्ट व्हॉइस चॅट ️',
            TextToSpeech: 'टीटीएस जनरेटर ',
            ClinicalTrialFinder: 'क्लिनिकल ट्रायल फाइंडर ',
            OtcSafetyGuide: 'ओटीसी सुरक्षा मार्गदर्शक ',
        },
        common: {
            loading: 'लोड होत आहे...',
            error: 'एक अनपेक्षित त्रुटी आली. कृपया पुन्हा प्रयत्न करा.',
            clear: 'साफ करा',
            sources: 'स्रोत',
            send: 'पाठवा',
        },
        feedback: {
            buttonLabel: 'अभिप्राय द्या',
            buttonText: 'अभिप्राय',
            modalTitle: 'अभिप्राय सबमिट करा',
            modalSubtitle: 'आम्हाला तुमचे विचार, सूचना किंवा समस्या ऐकायला आवडेल!',
            placeholder: 'तुमचा अभिप्राय येथे टाइप करा...',
            submitButton: 'सबमिट करा',
            submitting: 'सबमिट होत आहे...',
            close: 'मोडल बंद करा',
            thanksTitle: 'धन्यवाद!',
            thanksSubtitle: 'तुमचा अभिप्राय यशस्वीरित्या सबमिट झाला आहे.',
        },
        interactionChecker: {
            title: 'सर्वसमावेशक परस्परसंवाद तपासक ',
            subtitle: 'औषधे, औषधी वनस्पती, पूरक आणि अन्न यांच्यातील संभाव्य परस्परसंवादांची तपासणी करा.',
            tabs: {
                drugHerb: 'औषध-वनस्पती',
                drugDrug: 'औषध-औषध',
                drugSupplement: 'औषध-पूरक',
                drugFood: 'औषध-अन्न',
                polypharmacy: 'पॉलीफार्मसी',
            },
            drugLabel: 'औषधाचे नाव',
            drugPlaceholder: 'उदा., ऍटोरवास्टॅटिन',
            herbLabel: 'वनस्पतीचे नाव',
            herbPlaceholder: 'उदा., हळद',
            drug1Label: 'औषध १ चे नाव',
            drug1Placeholder: 'उदा., वॉर्फरिन',
            drug2Label: 'औषध २ चे नाव',
            drug2Placeholder: 'उदा., ऍस्पिरिन',
            supplementLabel: 'पूरक नाव',
            supplementPlaceholder: 'उदा., फिश ऑइल',
            foodLabel: 'अन्न/पेय नाव',
            foodPlaceholder: 'उदा., द्राक्षाचा रस',
            polypharmacyLabel: 'औषधांची सूची प्रविष्ट करा (प्रत्येक ओळीवर एक किंवा स्वल्पविरामाने वेगळे केलेले)',
            polypharmacyPlaceholder: 'उदा.,\nमेटफॉर्मिन\nलिसिनोप्रिल\nऍटोरवास्टॅटिन\n...',
            checking: 'तपासत आहे...',
            checkButton: 'परस्परसंवाद तपासा',
            validation: {
                bothEmpty: 'तपासण्यासाठी कृपया दोन्ही आयटम प्रविष्ट करा.',
                item1Empty: 'कृपया पहिला आयटम प्रविष्ट करा.',
                item2Empty: 'कृपया दुसरा आयटम प्रविष्ट करा.',
                polypharmacyEmpty: 'कृपया औषधांची सूची प्रविष्ट करा.',
                invalidChars: 'कृपया वैध नावे प्रविष्ट करा. केवळ संख्या किंवा विशेष अक्षरे वापरणे टाळा.'
            },
            examplesTitle: 'सामान्य परस्परसंवादांची उदाहरणे ',
            tryExample: 'हे उदाहरण वापरून पहा',
            noInteractionsFound: 'प्रदान केलेल्या औषधांमध्ये कोणतेही महत्त्वपूर्ण परस्परसंवाद आढळले नाहीत. सर्वसमावेशक पुनरावलोकनासाठी नेहमी आरोग्यसेवा व्यावसायिकांचा सल्ला घ्या.',
            polypharmacyResultsTitle: 'पॉलीफार्मसी परस्परसंवाद विश्लेषण',
            examples: {
                drugHerb: [
                    { input1: "वॉर्फरिन", input2: "सेंट जॉन वर्ट", explanation: "सेंट जॉन वर्ट यकृतातील एन्झाइम (CYP2C9) प्रेरित करू शकते जे वॉर्फरिनचे चयापचय करते, ज्यामुळे त्याची प्रभावीता कमी होते आणि रक्ताच्या गुठळ्या होण्याचा धोका वाढतो." },
                    { input1: "ऍस्पिरिन", input2: "जिन्कगो बिलोबा", explanation: "ऍस्पिरिन आणि जिन्कगो बिलोबा दोन्हीमध्ये अँटीप्लेटलेट (रक्त पातळ करणारे) प्रभाव असतात. ते एकत्र घेतल्याने गंभीर रक्तस्त्राव होण्याचा धोका लक्षणीयरीत्या वाढतो." },
                    { input1: "डिगॉक्सिन", input2: "जिनसेंग", explanation: "जिनसेंग डिगॉक्सिनची पातळी वाढवू शकते, ज्यामुळे विषारीपणाचा धोका वाढतो, ज्यामुळे मळमळ, दृष्टी बदल आणि अनियमित हृदयाची लय होऊ शकते." },
                    { input1: "ऍटोरवास्टॅटिन", input2: "लाल यीस्ट तांदूळ", explanation: "लाल यीस्ट तांदूळमध्ये मोनाकोलिन K असते, जे रासायनिकदृष्ट्या लोवास्टॅटिनसारखेच असते. ऍटोरवास्टॅटिनसारख्या दुसर्‍या स्टॅटिनसोबत एकत्र केल्यास स्नायूंचे नुकसान (मायोपॅथी) होण्याचा धोका वाढतो." }
                ],
                drugDrug: [
                    { input1: "लिसिनोप्रिल", input2: "स्पिरोनोलॅक्टोन", explanation: "दोन्ही औषधे रक्तातील पोटॅशियमची पातळी वाढवू शकतात. त्यांचा एकत्र वापर केल्याने हायपरकलेमियाचा धोका वाढतो, ज्यामुळे धोकादायक हृदय लय समस्या उद्भवू शकतात." },
                    { input1: "सिल्डेनाफिल", input2: "नायट्रोग्लिसरीन", explanation: "हे एकत्र केल्याने रक्तदाबात अचानक आणि गंभीर घट होऊ शकते, जे जीवघेणे असू शकते. हे संयोजन पूर्णपणे प्रतिबंधित आहे." },
                    { input1: "फ्लुओक्सेटीन", input2: "ट्रामाडोल", explanation: "दोन्ही औषधे मेंदूतील सेरोटोनिनची पातळी वाढवतात. त्यांचा एकत्र वापर केल्याने सेरोटोनिन सिंड्रोमचा धोका वाढतो, जो एक संभाव्य जीवघेणा स्थिती आहे." },
                    { input1: "क्लोपिडोग्रेल", input2: "ओमेप्राझोल", explanation: "ओमेप्राझोल क्लोपिडोग्रेलला त्याच्या सक्रिय स्वरूपात रूपांतरित करण्याची यकृताची क्षमता कमी करू शकते, ज्यामुळे संभाव्यतः त्याचा अँटीप्लेटलेट प्रभाव कमी होतो आणि हृदयविकाराचा झटका किंवा स्ट्रोकचा धोका वाढतो." }
                ],
                drugSupplement: [
                    { input1: "अँटीडिप्रेसंट्स (SSRIs)", input2: "5-HTP", explanation: "दोन्ही सेरोटोनिनची पातळी वाढवतात. त्यांना एकत्र केल्याने सेरोटोनिन सिंड्रोम होऊ शकतो, जो एक संभाव्य जीवघेणा स्थिती आहे ज्याची लक्षणे अस्वस्थता, जलद हृदयाचे ठोके आणि उच्च रक्तदाब आहेत." },
                    { input1: "लेवोथायरॉक्सिन", input2: "लोह पूरक", explanation: "लोह आतड्यातून लेवोथायरॉक्सिनचे शोषण कमी करू शकते, ज्यामुळे थायरॉईड औषध कमी प्रभावी होते. ते कमीतकमी 4 तासांच्या अंतराने घ्यावे." },
                    { input1: "वॉर्फरिन", input2: "व्हिटॅमिन ई", explanation: "व्हिटॅमिन ईच्या उच्च डोसमुळे वॉर्फरिनचे रक्त पातळ करण्याचे परिणाम वाढू शकतात, ज्यामुळे लक्षणीय रक्तस्त्राव होण्याचा धोका वाढतो. जवळून निरीक्षण करणे आवश्यक आहे." },
                    { input1: "मेटफॉर्मिन", input2: "क्रोमियम", explanation: "क्रोमियम इन्सुलिन आणि मेटफॉर्मिनसारख्या इतर मधुमेह औषधांचे परिणाम वाढवू शकते, ज्यामुळे हायपोग्लायसीमिया (कमी रक्तातील साखर) होण्याचा धोका वाढतो." }
                ],
                drugFood: [
                    { input1: "ऍटोरवास्टॅटिन", input2: "द्राक्षाचा रस", explanation: "द्राक्षाचा रस एक एन्झाइम (CYP3A4) प्रतिबंधित करतो जो स्टॅटिनचे चयापचय करतो, ज्यामुळे रक्तात औषधाची पातळी वाढते आणि स्नायू दुखण्यासारखे दुष्परिणाम होण्याचा धोका वाढतो." },
                    { input1: "वॉर्फरिन", input2: "पालेभाज्या (व्हिटॅमिन के)", explanation: "पालक आणि केलसारखे व्हिटॅमिन के समृद्ध असलेले पदार्थ वॉर्फरिनच्या रक्त पातळ करण्याच्या परिणामाचा प्रतिकार करू शकतात, ज्यामुळे ते कमी प्रभावी होते आणि गुठळ्या होण्याचा धोका वाढतो. सातत्यपूर्ण सेवन महत्त्वाचे आहे." },
                    { input1: "टेट्रासायक्लिन", input2: "दूध", explanation: "दुग्धजन्य पदार्थांमधील कॅल्शियम टेट्रासायक्लिनला बांधले जाते, ज्यामुळे त्याचे शोषण रोखले जाते आणि प्रतिजैविक म्हणून त्याची प्रभावीता कमी होते. दुग्धजन्य पदार्थांच्या 1 तास आधी किंवा 2 तासांनंतर घ्या." },
                    { input1: "ऍलेंड्रोनेट", input2: "कॉफी", explanation: "कॉफी आणि इतर पेये ऍलेंड्रोनेटसारख्या बिसफॉस्फोनेट्सचे शोषण 50% पेक्षा जास्त कमी करू शकतात. ते फक्त साध्या पाण्यासोबत घ्यावे." }
                ],
                polypharmacy: [
                  { title: "हृदय व मधुमेह काळजी", drugs: "मेटफॉर्मिन\nलिसिनोप्रिल\nऍटोरवास्टॅटिन\nऍस्पिरिन (81mg)", explanation: "टाइप 2 मधुमेह, उच्च रक्तदाब आणि उच्च कोलेस्ट्रॉल असलेल्या रुग्णांसाठी एक सामान्य संयोजन. ही तपासणी रक्तातील साखरेचे परिणाम आणि मूत्रपिंडाच्या कार्याचे निरीक्षण यासारख्या परस्परसंवादांवर लक्ष देईल." },
                  { title: "वेदना आणि रक्त पातळ करणारे मिश्रण", drugs: "वॉर्फरिन\nक्लोपिडोग्रेल\nआयबुप्रोफेन", explanation: "या संयोजनात दोन रक्त पातळ करणारे आणि एक NSAID समाविष्ट आहे. हे जठरांत्रीय रक्तस्त्रावासाठी एक उच्च-जोखमीचे दृश्य दर्शवते ज्यासाठी काळजीपूर्वक व्यवस्थापन आवश्यक आहे." },
                  { title: "मानसिक आरोग्य संयोजन", drugs: "फ्लुओक्सेटीन\nलोराझेपाम\nऍमिट्रिप्टिलाइन", explanation: "एक SSRI, एक बेंझोडायझेपाइन आणि एक ट्रायसायक्लिक अँटीडिप्रेसंट एकत्र केल्याने सेरोटोनिन सिंड्रोम आणि जास्त शांत होण्याचा धोका वाढू शकतो. ही तपासणी गंभीर CNS परस्परसंवादांवर प्रकाश टाकते." }
                ]
            }
        },
        resultCard: {
            category: { Safe: 'एकत्र वापरण्यास सुरक्षित', Caution: 'काळजीपूर्वक वापरा', Avoid: 'एकत्र वापरणे टाळा' },
            summary: 'क्लिनिकल सारांश', 
            mechanism: 'परस्परसंवादाची यंत्रणा', 
            evidenceLevel: 'पुराव्याचा स्तर', 
            sideEffects: 'संभाव्य दुष्परिणाम',
            severity: 'गंभीरता',
            interactionScore: 'जोखीम गुण',
            saferAlternatives: 'सुरक्षित पर्याय',
        },
        educational: {
            title: 'सुरक्षित औषध पद्धतींबद्दल जाणून घ्या ',
            articles: [
                { title: 'तुमचे प्रिस्क्रिप्शन समजून घेणे', content: 'तुमच्या डॉक्टरांनी दिलेल्या डोसच्या सूचनांचे नेहमी पालन करा. तुमचे औषध इतरांसोबत कधीही शेअर करू नका. औषधे मुलांपासून दूर थंड, कोरड्या जागी ठेवा.' },
                { title: 'स्व-औषधाचा धोका', content: 'स्व-औषधामुळे चुकीचा डोस, प्रतिकूल प्रतिक्रिया किंवा अधिक गंभीर मूळ स्थिती लपविली जाऊ शकते. कोणतेही नवीन उपचार सुरू करण्यापूर्वी नेहमी आरोग्यसेवा व्यावसायिकांचा सल्ला घ्या.' },
                { title: 'हर्बल सप्लिमेंट्स आणि आधुनिक औषध', content: 'अनेक औषधी वनस्पतींमध्ये औषधी गुणधर्म असले तरी, ते प्रिस्क्रिप्शन औषधांशी संवाद साधू शकतात. तुम्ही घेत असलेल्या सर्व सप्लिमेंट्सबद्दल तुमच्या डॉक्टरांना माहिती देणे महत्त्वाचे आहे.' },
            ],
        },
        doctorsCorner: {
            title: 'आरोग्यसेवा व्यावसायिकांसाठी संसाधने ‍️',
            subtitle: 'क्युरेटेड, उच्च-गुणवत्तेच्या वैद्यकीय डेटाबेस आणि संसाधनांमध्ये प्रवेश करा.',
            section1Title: 'व्यावसायिक डेटाबेस', section2Title: 'सामान्य आरोग्य संसाधने',
        },
        references: {
            title: 'अधिकृत आरोग्य संसाधने ',
            subtitle: 'आमच्या साधनांद्वारे प्रदान केलेली माहिती या प्रतिष्ठित स्रोतांकडून संकलित आणि सत्यापित केली जाते.',
            visitSite: 'साइटला भेट द्या',
        },
        prescriptionReader: {
            title: 'स्मार्ट प्रिस्क्रिप्शन रीडर ',
            subtitle: 'तपशील काढण्यासाठी तुमच्या प्रिस्क्रिप्शनची स्पष्ट प्रतिमा अपलोड करा.',
            uploadButton: 'प्रिस्क्रिप्शन अपलोड करण्यासाठी क्लिक करा',
            orDrag: 'किंवा येथे एक प्रतिमा ड्रॅग आणि ड्रॉप करा',
            analyzing: 'प्रिस्क्रिप्शनचे विश्लेषण करत आहे...',
            resultsTitle: 'काढलेले प्रिस्क्रिप्शन तपशील',
            patient: 'रुग्णाचे नाव',
            doctor: 'डॉक्टरांचे नाव',
            date: 'प्रिस्क्रिप्शनची तारीख',
            age: 'वय',
            gender: 'लिंग',
            clinic: 'क्लिनिक / रुग्णालय',
            doctorRegNo: "डॉक्टर नोंदणी क्र.",
            patientInfoTitle: "रुग्णाची माहिती",
            doctorInfoTitle: "डॉक्टर आणि क्लिनिकची माहिती",
            table: {
                drug: 'औषधाचे नाव',
                dosage: 'डोस',
                frequency: 'वारंवारता',
                actions: 'क्रिया',
            },
            viewDetails: 'तपशील पहा',
            hideDetails: 'तपशील लपवा',
            fetchingDetails: 'औषधाचे तपशील आणत आहे...',
            details: {
                description: 'वर्णन',
                indications: 'संकेत',
                sideEffects: 'सामान्य दुष्परिणाम',
                relatedDrugs: 'संबंधित औषधे आणि पर्याय',
                warnings: 'महत्वाच्या चेतावणी',
            },
            tips: {
                title: 'सर्वोत्तम परिणामांसाठी',
                tip1: 'प्रिस्क्रिप्शन एका सपाट पृष्ठभागावर चांगल्या प्रकाशात ठेवा.',
                tip2: 'कागदावर सावल्या आणि चकाकी टाळा.',
                tip3: 'संपूर्ण प्रिस्क्रिप्शन फोटोमध्ये दिसेल याची खात्री करा.',
                tip4: 'मजकूर फोकसमध्ये आहे आणि अस्पष्ट नाही याची खात्री करा.',
            },
            howItWorks: {
                title: 'स्मार्ट प्रिस्क्रिप्शन रीडर कसे कार्य करते',
                steps: [
                    { emoji: '', title: '१. अपलोड करा', description: 'तुमच्या प्रिस्क्रिप्शनचा स्पष्ट फोटो घ्या किंवा PDF अपलोड करा' },
                    { emoji: '', title: '२. ओसीआर विश्लेषण', description: 'प्रगत ओसीआर हस्तलिखित प्रिस्क्रिप्शनमधून मजकूर काढतो' },
                    { emoji: '', title: '३. एआय पडताळणी', description: 'एआय भारतीय फार्माकोपिया डेटाबेससह क्रॉस-चेक करते' },
                    { emoji: '', title: '४. तपशीलवार अहवाल', description: 'सर्वसमावेशक औषध सुरक्षा अहवाल तयार करा' },
                ]
            },
            errors: {
                safety: "सुरक्षेच्या कारणास्तव प्रिस्क्रिप्शन प्रतिमेचे विश्लेषण करता आले नाही. कृपया खात्री करा की त्यात आवश्यकतेपेक्षा जास्त संवेदनशील वैयक्तिक माहिती नाही.",
                unreadable: "एआय प्रतिमेवरील मजकूर वाचू शकला नाही. कृपया एक स्पष्ट, चांगल्या प्रकाशातील फोटो घेऊन पुन्हा अपलोड करण्याचा प्रयत्न करा."
            },
            verifyTitle: "कृपया सत्यापित करा",
            verifyText: "एआय काढताना कधीकधी चुका होऊ शकतात. कृपया कोणतीही कारवाई करण्यापूर्वी खालील तपशिलांची तुमच्या भौतिक प्रिस्क्रिप्शनशी काळजीपूर्वक तुलना करा.",
            interactionTitle: "प्रिस्क्रिप्शन परस्परसंवाद विश्लेषण",
            checkingInteractions: "परस्परसंवादांची तपासणी करत आहे...",
        },
        pillIdentifier: {
            title: 'एआय गोळी ओळखकर्ता ',
            subtitle: 'गोळ्या त्यांच्या दिसण्यावरून, नावाने किंवा पॅकेजिंगवरून ओळखा.',
            uploadLabel: 'गोळीची प्रतिमा अपलोड करण्यासाठी क्लिक करा',
            analyzingImage: 'प्रतिमेचे विश्लेषण करत आहे...',
            searching: 'शोधत आहे...',
            resultsTitle: 'गोळी ओळख परिणाम',
            identifyByPill: 'गोळीच्या प्रतिमेवरून',
            identifyByName: 'नावावरून',
            identifyByPackage: 'पॅकेजच्या प्रतिमेवरून',
            drugLabel: 'औषधाचे नाव',
            namePlaceholder: 'उदा., क्रोसिन',
            searchButton: 'शोधा',
            packageUploadLabel: 'पॅकेजची प्रतिमा अपलोड करण्यासाठी क्लिक करा',
            newSearch: 'नवीन शोध',
            examples: {
                title: "किंवा एक उदाहरण वापरून पहा:",
                name: [
                    { name: "पॅरासिटामॉल 500mg" },
                    { name: "आयबुप्रोफेन 200mg" },
                    { name: "ऍस्पिरिन 75mg" },
                    { name: "ऍटोरवास्टॅटिन 10mg" },
                    { name: "मेटफॉर्मिन 500mg" },
                    { name: "अमॉक्सिसिलिन 250mg" }
                ]
            }
        },
        doseCalculator: {
            title: 'एआय डोस कॅल्क्युलेटर ️',
            subtitle: 'शिफारस केलेल्या डोसची गणना करण्यासाठी खालील तपशील प्रविष्ट करा.',
            calculateButton: 'डोसची गणना करा',
            calculating: 'गणना करत आहे...',
            resultsTitle: 'डोस गणना परिणाम',
            form: {
                patientTitle: 'रुग्णाची माहिती',
                patientSubtitle: 'अचूक गणनेसाठी रुग्णाचे तपशील प्रविष्ट करा.',
                ageLabel: 'वय प्रविष्ट करा (वर्षे)',
                agePlaceholder: 'उदा., 35',
                weightLabel: 'वजन प्रविष्ट करा (किलो)',
                weightPlaceholder: 'उदा., 70',
                genderLabel: 'लिंग निवडा',
                genders: { male: 'पुरुष', female: 'महिला', other: 'इतर' },
                drugTitle: 'औषध निवड',
                drugLabel: 'औषध निवडा',
                drugPlaceholder: 'उदा., पॅरासिटामॉल',
                indicationLabel: 'संकेत निवडा',
                indicationPlaceholder: 'उदा., ताप',
                renalLabel: 'मूत्रपिंडाची स्थिती',
                hepaticLabel: 'यकृताची स्थिती',
                status: { normal: 'सामान्य', mild: 'सौम्य कमजोरी', moderate: 'मध्यम कमजोरी', severe: 'गंभीर कमजोरी' }
            },
            results: {
                recommended: 'शिफारस केलेला डोस',
                max: 'कमाल सुरक्षित डोस',
                notes: 'समायोजन टिपा',
            }
        },
        symptomChecker: {
            title: 'एआय लक्षण तपासक ',
            subtitle: 'एआय-चालित प्राथमिक विश्लेषण मिळविण्यासाठी तुमच्या लक्षणांचे वर्णन करा.',
            inputLabel: 'तुमच्या लक्षणांचे वर्णन करा',
            inputPlaceholder: 'उदा., मला डोकेदुखी, 101°F ताप आणि घसा खवखवत आहे...',
            analyzeButton: 'लक्षणांचे विश्लेषण करा',
            analyzing: 'विश्लेषण करत आहे...',
            resultsTitle: 'लक्षण विश्लेषण परिणाम',
            disclaimerTitle: 'महत्वाचे अस्वीकरण',
            nextSteps: 'सुचवलेले पुढील टप्पे',
            confidence: {
                High: "उच्च आत्मविश्वास",
                Medium: "मध्यम आत्मविश्वास",
                Low: "कमी आत्मविश्वास"
            },
            emergencyWarningTitle: "आपत्कालीन चेतावणी",
            reasoning: "तर्क"
        },
        clinicalTrialFinder: {
            title: 'क्लिनिकल ट्रायल फाइंडर (भारत) ',
            subtitle: 'एखाद्या स्थिती किंवा औषधावर आधारित भारतातील चालू असलेल्या क्लिनिकल चाचण्या शोधा.',
            searching: 'शोधत आहे...',
            searchButton: 'शोधा',
            noResults: 'तुमच्या क्वेरीसाठी कोणतीही क्लिनिकल चाचणी आढळली नाही.',
            resultsTitle: 'क्लिनिकल चाचणी परिणाम',
            filters: {
                title: 'शोध आणि फिल्टर्स',
                subtitle: 'तुमच्या निकषांनुसार चाचण्या कमी करा',
                searchPlaceholder: 'रोग, औषध, प्रायोजक...',
                allPhases: 'सर्व टप्पे',
                allLocations: 'सर्व ठिकाणे',
                allStatus: 'सर्व स्थिती',
                apply: 'फिल्टर्स लावा',
                clear: 'फिल्टर्स साफ करा'
            }
        },
        otcGuide: {
            title: 'ओटीसी औषध सुरक्षा मार्गदर्शक ',
            subtitle: 'कोणत्याही ओव्हर-द-काउंटर औषधासाठी सुरक्षा मार्गदर्शक मिळवा.',
            drugPlaceholder: 'उदा., आयबुप्रोफेन',
            gettingGuide: 'मार्गदर्शक मिळवत आहे...',
            getGuideButton: 'मार्गदर्शक मिळवा',
            resultsTitle: 'साठी सुरक्षा मार्गदर्शक',
            results: {
                indications: 'संकेत',
                warnings: 'महत्वाच्या चेतावणी',
                safeDose: 'सुरक्षित डोस',
                maxDose: 'कमाल डोस',
                contraindications: 'मतभेद',
                sideEffects: 'दुष्परिणाम',
                interactions: 'परस्परक्रिया',
            },
            rulesTitle: 'ओटीसी वापराचे ५ सुवर्ण नियम ',
            rules: [
                { emoji: '', title: 'लेबल वाचा', description: 'कोणतेही ओटीसी औषध घेण्यापूर्वी नेहमी सर्व घटक आणि दिशानिर्देश वाचा.' },
                { emoji: '️', title: 'परस्परसंवाद तपासा', description: 'ओटीसी औषधे तुमच्या प्रिस्क्रिप्शन औषधांशी संवाद साधणार नाहीत याची पडताळणी करा.' },
                { emoji: '', title: 'डोसचे पालन करा', description: 'शिफारस केलेल्या डोसपेक्षा जास्त घेऊ नका. जास्त नेहमीच चांगले नसते आणि धोकादायक असू शकते.' },
                { emoji: '⏰', title: 'वेळेची मर्यादा', description: 'शिफारस केलेल्या वेळेपेक्षा जास्त काळ ओटीसी औषधे वापरू नका. लक्षणे कायम राहिल्यास डॉक्टरांना भेटा.' },
                { emoji: '‍️', title: 'व्यावसायिकांना विचारा', description: 'तुमचे काही प्रश्न किंवा चिंता असल्यास फार्मासिस्ट किंवा डॉक्टरांचा सल्ला घ्या.' },
            ]
        },
        pharmacistChatbot: {
            title: 'व्हर्च्युअल फार्मासिस्ट चॅट ‍️',
            subtitle: 'हे केवळ माहितीच्या उद्देशाने आहे.',
            welcomeMessage: 'नमस्कार! मी तुमचा एआय फार्मासिस्ट आहे. मी आज तुमच्या औषधांच्या प्रश्नांमध्ये कशी मदत करू शकेन?',
            inputPlaceholder: 'तुमचा प्रश्न टाइप करा, किंवा माइक वापरा...',
            recording: 'ऑडिओ रेकॉर्ड होत आहे... ',
            transcribing: 'ऑडिओचे प्रतिलेखन होत आहे... ️',
            startRecording: 'रेकॉर्डिंग सुरू करा',
            stopRecording: 'रेकॉर्डिंग थांबवा',
            micError: 'मायक्रोफोन प्रवेश नाकारला. कृपया तुमच्या ब्राउझर सेटिंग्जमध्ये मायक्रोफोन प्रवेशास अनुमती द्या.',
            transcriptionError: 'प्रतिलेखन अयशस्वी. कृपया पुन्हा प्रयत्न करा.',
        },
        livePharmacist: {
            title: 'लाइव्ह फार्मासिस्ट व्हॉइस चॅट ️',
            subtitle: 'त्वरित उत्तरांसाठी थेट आमच्या एआय फार्मासिस्टशी बोला.',
            start: 'संभाषण सुरू करा',
            stop: 'संभाषण समाप्त करा',
            status: {
                connecting: 'कनेक्ट करत आहे...',
                connected: 'कनेक्ट झाले. तुम्ही आता बोलणे सुरू करू शकता.',
                disconnected: 'सत्र संपले. पुन्हा बोलण्यासाठी स्टार्टवर क्लिक करा.',
                error: 'कनेक्शन त्रुटी. कृपया पुन्हा प्रयत्न करा.'
            },
            you: 'तुम्ही',
            bot: 'एआय फार्मासिस्ट'
        },
        ttsGenerator: {
            title: 'टेक्स्ट-टू-स्पीच जनरेटर ',
            subtitle: 'मजकूराचे उच्च-गुणवत्तेच्या बोललेल्या ऑडिओमध्ये रूपांतर करा.',
            placeholder: 'येथे मजकूर प्रविष्ट करा...',
            voiceLabel: 'एक आवाज निवडा',
            generate: 'भाषण तयार करा',
            generating: 'तयार होत आहे...',
            voices: {
                Zephyr: 'झेफिर (मैत्रीपूर्ण)',
                Puck: 'पक (शांत)',
                Charon: 'कॅरॉन (खोल)',
                Kore: 'कोर (उबदार)',
                Fenrir: 'फेनरिर (उजळ)'
            }
        }
    }
  };

@Injectable({
    providedIn: 'root'
})
export class TranslationService {
    private langObj = new BehaviorSubject<'en' | 'hi' | 'mr'>('en');
    language$ = this.langObj.asObservable();

    get language() {
        return this.langObj.value;
    }

    setLanguage(lang: 'en' | 'hi' | 'mr') {
        this.langObj.next(lang);
    }

    t(key: string): string {
        const keys = key.split('.');
        let result: any = (translations as any)[this.language];
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                let fallbackResult: any = translations.en;
                for (const fk of keys) {
                    fallbackResult = fallbackResult?.[fk];
                    if (fallbackResult === undefined) return key;
                }
                return fallbackResult as string;
            }
        }
        return result as string;
    }

    getLocalizedContent(key: string): any[] {
        const keys = key.split('.');
        let result: any = (translations as any)[this.language];
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) {
                let fallbackResult: any = translations.en;
                for (const fk of keys) {
                    fallbackResult = fallbackResult?.[fk];
                    if (fallbackResult === undefined) return [];
                }
                return fallbackResult;
            }
        }
        return result || [];
    }
}
