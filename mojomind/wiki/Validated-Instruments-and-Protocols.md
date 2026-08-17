# 🧠 Validated Instruments & Clinical Protocols

## 📌 Clinical Overview

MojaMind administers standardized, validated psychometric assessment instruments configured in direct accordance with the **Stellenbosch University** and **SHOUT-IT-NOW** Creative Resilience research protocol.

---

## 📊 Complete 21-Survey Suite Architecture

The intervention evaluates participants across three distinct study cohorts at two critical time points (**Pre-Intervention** at Week 0, and **Post-Intervention** at Week 8):

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PRE-SURVEY (3 Modules)                          │
├─────────────────────────┬──────────────────────┬───────────────────────┤
│ Mental Health (16 Qs)   │ Lifestyle (10 Qs)    │ Wellbeing (10 Qs)     │
│ • PHQ-9 (9 items)       │ • MARS-5 (5 items)   │ • BRS (6 items)       │
│ • GAD-7 (7 items)       │ • Stigma-5 (5 items) │ • CAGE-AID (4 items)  │
└─────────────────────────┴──────────────────────┴───────────────────────┘

┌────────────────────────────────────────────────────────────────────────┐
│                        POST-SURVEY (4 Modules)                         │
├─────────────────────────┬──────────────────────┬───────────────────────┼─────────────────────────┤
│ Mental Health (16 Qs)   │ Lifestyle (10 Qs)    │ Wellbeing (10 Qs)     │ Usability (18 Qs)       │
│ • PHQ-9 (9 items)       │ • MARS-5 (5 items)   │ • BRS (6 items)       │ • MAUQ Usability scale  │
│ • GAD-7 (7 items)       │ • Stigma-5 (5 items) │ • CAGE-AID (4 items)  │                         │
└─────────────────────────┴──────────────────────┴───────────────────────┴─────────────────────────┘
```

* **Group 1**: 3 Pre-Surveys + 4 Post-Surveys = **7 Surveys**
* **Group 2**: 3 Pre-Surveys + 4 Post-Surveys = **7 Surveys**
* **Group 3**: 3 Pre-Surveys + 4 Post-Surveys = **7 Surveys**
* **Total Study Survey Modules**: **21 Surveys**

---

## 📋 Instrument Breakdown

### 1. Mental Health Survey (16 Questions)
* **PHQ-9 (Patient Health Questionnaire - 9 items)**:
  * Measures depression severity over the preceding two weeks.
  * 4-point response scale: *Not at all (0)*, *Several days (1)*, *More than half the days (2)*, *Nearly every day (3)*.
* **GAD-7 (Generalized Anxiety Disorder - 7 items)**:
  * Measures generalized anxiety symptoms and emotional tension.
  * 4-point response scale matching PHQ-9.

### 2. Lifestyle Management Survey (10 Questions)
* **MARS-5 (Medication Adherence Report Scale - 5 items)**:
  * Assesses self-reported barriers, dose alterations, and adherence to prescribed antiretroviral / medical regimens.
  * 5-point scale: *Always (1)*, *Often (2)*, *Sometimes (3)*, *Rarely (4)*, *Never (5)*.
* **Stigma-5 (5-Question Stigma Indicator - 5 items)**:
  * Assesses internal and social stigma experienced over the past year.
  * 3-point scale: *Never*, *Sometimes*, *Often/usually*.

### 3. Personal Wellbeing Survey (10 Questions)
* **BRS (Brief Resilience Scale - 6 items)**:
  * Measures the ability to bounce back from stress and adversity.
  * 5-point Likert scale: *Strongly Disagree (1)* to *Strongly Agree (5)* with reverse-scored items.
* **CAGE-AID (Adapted for Alcohol & Drugs - 4 items)**:
  * Validated screen for problematic substance use.
  * Binary response: *Yes / No*.

### 4. App Usability Survey (18 Questions — Post-Survey Only)
* **MAUQ (mHealth App Usability Questionnaire - 18 items)**:
  * Evaluates interface design, ease of use, system reliability under weak networks, and perceived health benefits.
  * 7-point Likert scale: *Strongly Agree (1)* to *Strongly Disagree (7)*.

---

## 🚨 Automated Clinical Risk Screening & Mitigation

To ensure participant safety throughout the intervention, `MM.RISK` evaluates all survey submissions in real time on the client device:

### Trigger Criteria
1. **Severe Depression**: Total PHQ-9 sum score $\ge 20$ (range 20–27).
2. **Suicide Ideation**: PHQ-9 Question 9 (*"Thoughts that you would be better off dead or of hurting yourself in some way"*) answered as **"Nearly every day" (3)**.

### Real-Time Escalation Protocol
1. **Supportive User Notification**: Displays a sensitive modal dialog without stigmatizing clinical terminology:
   > *"Your responses suggest that you may be experiencing some challenges, and we would like to offer additional support. A social worker will contact you to offer assistance."*
2. **Confidential Ticket Creation**: Logs a priority care ticket (`Wellbeing check-in requested`) directly into the facilitator stream and sync queue.
3. **Immediate Crisis Helplines**: Provides one-touch dialing access to South African national crisis lines:
   * **SADAG Suicide Crisis Line**: 0800 567 567
   * **Lifeline National Counselling**: 0861 322 322
   * **Childline South Africa**: 116

---

*© 2026 IONITY Global (Pty) Ltd · Solutionist: Johan Wilhelm van Antwerp*
