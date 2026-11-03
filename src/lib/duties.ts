/**
 * Duties of a cardiovascular perfusionist, as supplied by TaCPA (Alfred Luvakule, 2026-11-03).
 * Wording is kept close to the original list; only spelling, grammar and consistency were tidied.
 * Numbering matches the original list. `tag` is a short theme label added for scanning.
 */
export type Duty = { text: string; sub?: string[]; tag: string };
export type DutyArea = {
  id: "cardiac" | "oncology" | "orthopaedics";
  title: string;
  short: string;
  settings: string[];
  intro: string;
  duties: Duty[];
};

export const DUTY_AREAS: DutyArea[] = [
  {
    id: "cardiac",
    title: "Cardiac surgery, cath lab & ICU",
    short: "Cardiac surgery",
    settings: ["Cardiac theatre", "Cath lab", "ICU"],
    intro:
      "Running the heart-lung machine and other extracorporeal support, protecting the heart, and keeping the patient's physiology safe before, during and after surgery.",
    duties: [
      { tag: "Monitoring", text: "Measuring various blood and other parameters to identify the appropriate mechanical, pharmacological and thermal manipulation needed to maintain a physiological state." },
      {
        tag: "Equipment",
        text: "Operating and selecting a variety of extracorporeal circulation equipment, such as:",
        sub: ["the heart-lung machine", "the artificial heart", "blood transfusion devices", "the intra-aortic balloon pump and various ventricular assist devices"],
      },
      { tag: "Patient care", text: "Monitoring and care management of the patient during surgery to ensure safe physiological function." },
      { tag: "Blood & drugs", text: "Routine administration of various types of blood products and medications to patients during surgery." },
      { tag: "Administration", text: "A variety of administrative duties, such as equipment management, supply purchasing, department management and quality improvement." },
      { tag: "Preparation", text: "Studying the patient's medical history and notes to be prepared for surgery." },
      { tag: "Blood management", text: "Placement and management of the Cell Saver on the patient." },
      { tag: "Transplant", text: "Working with the transplant coordinator in the procurement of cardiothoracic donor organs for transplantation." },
      { tag: "Myocardial protection", text: "Myocardial preservation during cardiac surgery, providing the surgeon with a clear surgical field and a non-beating heart." },
      { tag: "Transplant", text: "Participating in heart, heart-lung, liver and kidney transplantation." },
      { tag: "Myocardial protection", text: "Managing optimal myocardial preservation and regulating CPB temperature accordingly." },
      { tag: "Equipment", text: "Performing patient calculations, and selecting, setting up, priming, operating and maintaining the appropriate specialised cardiovascular perfusion equipment for a variety of surgical procedures, such as cardiac surgery, vascular surgery and organ transplantation." },
      { tag: "Monitoring", text: "Monitoring physiological responses to cardiopulmonary bypass by monitoring flows and pressures (such as venous return)." },
      { tag: "Laboratory", text: "Collecting and analysing blood samples, and monitoring laboratory results." },
      { tag: "Equipment", text: "Assisting medical staff with equipment evaluations related to cardiovascular perfusion, as directed, by providing feedback and input." },
      { tag: "Research", text: "Participating in perfusion science research projects by reviewing literature, modifying current equipment and procedures, and/or developing and testing new equipment and procedures under the direction of the cardiac surgeons and/or anaesthetists." },
      { tag: "ECMO", text: "Performing extracorporeal membrane oxygenation (ECMO) in the ICU and during procedures." },
      {
        tag: "CPB",
        text: "Maintaining homeostasis during the cardiopulmonary bypass run, maintaining the chemistry and physiology of the patient on bypass, and placing and managing patients on:",
        sub: ["a ventricular assist device as a bridge to recovery, or", "heart transplantation, and", "supporting patients receiving a lung or liver transplant"],
      },
      { tag: "Monitoring", text: "Monitoring the vital signs, blood cell count and circulation of the patient during surgery, and adjusting the machine when needed." },
      { tag: "Laboratory", text: "Collecting and processing blood samples." },
      { tag: "Equipment", text: "Selecting the most suitable equipment based on the patient's needs." },
      { tag: "Equipment", text: "Evaluating the machine's condition during surgery." },
    ],
  },
  {
    id: "oncology",
    title: "Oncology",
    short: "Oncology",
    settings: ["Isolated limb perfusion", "Isolated limb infusion"],
    intro: "Using an isolated extracorporeal circuit to deliver high-dose treatment to a limb while protecting the rest of the body.",
    duties: [
      {
        tag: "ILP",
        text: "Performing Isolated Limb Perfusion (ILP), involving:",
        sub: [
          "administration and monitoring of pharmaceutical drugs such as melphalan, and radiopharmaceuticals such as technetium-99m-labelled human serum albumin",
          "use of an extracorporeal circuit to oxygenate limb tissues that are separated from the circulation, and to provide hyperthermia",
        ],
      },
      { tag: "ILI", text: "Performing Isolated Limb Infusion (ILI)." },
    ],
  },
  {
    id: "orthopaedics",
    title: "Orthopaedics",
    short: "Orthopaedics",
    settings: ["Blood management"],
    intro: "Saving the patient's own blood during major orthopaedic surgery.",
    duties: [
      { tag: "Blood management", text: "Placement and management of the Cell Saver (red cell salvage and autotransfusion) on the patient as part of a blood management programme." },
    ],
  },
];

export const TOTAL_DUTIES = DUTY_AREAS.reduce((n, a) => n + a.duties.length, 0);
