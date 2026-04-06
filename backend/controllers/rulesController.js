const RulesPolicy = require("../models/RulesPolicy");
const AuditLog = require("../models/AuditLog");

const defaultRulesPolicy = {
  page_title: "Rules and Regulations",
  intro_text:
    "Please read and follow these rules to maintain a safe, respectful, and comfortable environment for all residents.",
  last_updated_label: "Last updated: April 2026",
  sections: [
    {
      section_id: "admission-eligibility",
      title: "Admission and Eligibility",
      description: "Requirements for joining the hostel.",
      points: [
        "Residents must provide valid ID proof and required academic documents during admission.",
        "Admission is subject to room availability and management approval.",
        "False or incomplete information may lead to cancellation of admission."
      ],
      sort_order: 1
    },
    {
      section_id: "fees-payments",
      title: "Fees and Payments",
      description: "Payment timelines and rules.",
      points: [
        "Monthly fee must be paid on or before the due date informed by management.",
        "Late fee may be charged for delayed payments.",
        "Security deposit terms and refund timelines are governed by signed admission terms."
      ],
      sort_order: 2
    },
    {
      section_id: "discipline-conduct",
      title: "Discipline and Conduct",
      description: "Expected resident behavior.",
      points: [
        "Residents must maintain respectful behavior with staff and fellow residents.",
        "Physical fights, abuse, or harassment are strictly prohibited.",
        "Any illegal activity will be reported to authorities immediately."
      ],
      sort_order: 3
    },
    {
      section_id: "curfew-visitors",
      title: "Curfew and Visitors",
      description: "Entry timings and guest policies.",
      points: [
        "Residents should follow hostel gate timings and curfew rules.",
        "Visitors are allowed only in designated areas during permitted hours.",
        "Overnight stay of non-residents is not allowed unless approved in writing by management."
      ],
      sort_order: 4
    },
    {
      section_id: "cleanliness-maintenance",
      title: "Cleanliness and Maintenance",
      description: "Room upkeep and property care.",
      points: [
        "Residents are responsible for keeping rooms and common areas clean.",
        "Damaging hostel property may result in penalties and recovery charges.",
        "Maintenance issues should be reported promptly to management."
      ],
      sort_order: 5
    },
    {
      section_id: "safety-security",
      title: "Safety and Security",
      description: "Measures for personal and hostel safety.",
      points: [
        "Residents must cooperate with security checks whenever required.",
        "Sharing room keys/access credentials with outsiders is prohibited.",
        "Management is not responsible for loss of valuables kept unsecured."
      ],
      sort_order: 6
    },
    {
      section_id: "prohibited-items",
      title: "Prohibited Items and Activities",
      description: "Items and activities not permitted in hostel premises.",
      points: [
        "Consumption or possession of alcohol, drugs, and other banned substances is prohibited.",
        "Smoking inside rooms and restricted zones is not allowed.",
        "Cooking devices and unsafe electrical appliances are not allowed unless approved."
      ],
      sort_order: 7
    },
    {
      section_id: "violations-termination",
      title: "Violations and Termination",
      description: "Actions on non-compliance.",
      points: [
        "Repeated violation of rules may lead to warnings, fines, or expulsion.",
        "In serious cases, management can terminate stay without prior notice.",
        "Management reserves the right to update rules for safety and operational needs."
      ],
      sort_order: 8
    }
  ]
};

function normalizeSectionId(value, fallbackIndex) {
  const normalized = String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return normalized || `section-${fallbackIndex + 1}`;
}

function sanitizeSections(sections) {
  if (!Array.isArray(sections)) {
    return [];
  }

  return sections
    .map((section, index) => {
      const title = String(section?.title || "").trim();
      if (!title) {
        return null;
      }

      const points = Array.isArray(section?.points)
        ? section.points.map((point) => String(point || "").trim()).filter(Boolean)
        : [];

      return {
        section_id: normalizeSectionId(section.section_id || title, index),
        title,
        description: String(section?.description || "").trim(),
        points,
        sort_order: Number.isFinite(Number(section?.sort_order)) ? Number(section.sort_order) : index + 1
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((section, index) => ({
      ...section,
      sort_order: index + 1
    }));
}

async function findOrCreateRulesPolicy() {
  const existing = await RulesPolicy.findOne({ singleton_key: "primary" });
  if (existing) {
    return existing;
  }

  return RulesPolicy.create({
    singleton_key: "primary",
    ...defaultRulesPolicy
  });
}

async function getRulesPolicy(_req, res) {
  const record = await findOrCreateRulesPolicy();
  return res.json(record);
}

async function updateRulesPolicy(req, res) {
  const pageTitle = String(req.body?.page_title || "").trim();
  const introText = String(req.body?.intro_text || "").trim();
  const lastUpdatedLabel = String(req.body?.last_updated_label || "").trim();
  const sections = sanitizeSections(req.body?.sections);

  if (!pageTitle) {
    return res.status(400).json({ message: "page_title is required" });
  }

  if (!sections.length) {
    return res.status(400).json({ message: "At least one section is required" });
  }

  const record = await findOrCreateRulesPolicy();
  record.page_title = pageTitle;
  record.intro_text = introText;
  record.last_updated_label = lastUpdatedLabel;
  record.sections = sections;
  await record.save();

  await AuditLog.create({
    admin_id: req.user.id,
    action: "update_rules_policy",
    target_type: "RulesPolicy",
    target_id: String(record._id),
    details: {
      sections_count: sections.length
    }
  });

  return res.json(record);
}

async function resetRulesPolicy(req, res) {
  const record = await findOrCreateRulesPolicy();
  record.page_title = defaultRulesPolicy.page_title;
  record.intro_text = defaultRulesPolicy.intro_text;
  record.last_updated_label = defaultRulesPolicy.last_updated_label;
  record.sections = defaultRulesPolicy.sections;
  await record.save();

  await AuditLog.create({
    admin_id: req.user.id,
    action: "reset_rules_policy",
    target_type: "RulesPolicy",
    target_id: String(record._id),
    details: { reset: true }
  });

  return res.json(record);
}

module.exports = {
  defaultRulesPolicy,
  getRulesPolicy,
  updateRulesPolicy,
  resetRulesPolicy
};
