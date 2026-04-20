const validatePartC = (req, res, next) => {
  const errors = [];
  const isPutOrDelete = ['PUT', 'DELETE'].includes(req.method);

  if (!isPutOrDelete && !req.body.employee_id) {
    errors.push('employee_id is required');
  }

  if (req.body.conferences) {
    req.body.conferences.forEach((conf, index) => {
      if (!conf.title) errors.push(`conferences[${index}].title is required`);
      if (!conf.conference_name) errors.push(`conferences[${index}].conference_name is required`);
      if (!conf.author_position) errors.push(`conferences[${index}].author_position is required`);
      if (!conf.year) errors.push(`conferences[${index}].year is required`);
    });
  }

  if (req.body.journals) {
    req.body.journals.forEach((journal, index) => {
      if (!journal.title) errors.push(`journals[${index}].title is required`);
      if (!journal.journal_name) errors.push(`journals[${index}].journal_name is required`);
      if (!journal.author_position) errors.push(`journals[${index}].author_position is required`);
      if (!journal.year) errors.push(`journals[${index}].year is required`);
      if (journal.quartile && !['Q1', 'Q2', 'Q3', 'Q4'].includes(journal.quartile)) {
        errors.push(`journals[${index}].quartile must be Q1, Q2, Q3, or Q4`);
      }
    });
  }

  if (req.body.citations) {
    req.body.citations.forEach((citation, index) => {
      if (!citation.year) errors.push(`citations[${index}].year is required`);
      if (citation.q1_count !== undefined && citation.q1_count < 0) {
        errors.push(`citations[${index}].q1_count must be >= 0`);
      }
      if (citation.other_count !== undefined && citation.other_count < 0) {
        errors.push(`citations[${index}].other_count must be >= 0`);
      }
    });
  }

  if (req.body.book_chapters) {
    req.body.book_chapters.forEach((chapter, index) => {
      if (!chapter.chapter_title) errors.push(`book_chapters[${index}].chapter_title is required`);
      if (!chapter.book_title) errors.push(`book_chapters[${index}].book_title is required`);
      if (!chapter.author_position) errors.push(`book_chapters[${index}].author_position is required`);
    });
  }

  if (req.body.textbooks) {
    req.body.textbooks.forEach((textbook, index) => {
      if (!textbook.book_title) errors.push(`textbooks[${index}].book_title is required`);
      if (!textbook.author_position) errors.push(`textbooks[${index}].author_position is required`);
    });
  }

  if (req.body.research_projects) {
    req.body.research_projects.forEach((project, index) => {
      if (!project.title) errors.push(`research_projects[${index}].title is required`);
      if (!project.role) errors.push(`research_projects[${index}].role is required`);
      if (!project.status) errors.push(`research_projects[${index}].status is required`);
      if (project.funding_amount !== undefined && project.funding_amount < 0) {
        errors.push(`research_projects[${index}].funding_amount must be >= 0`);
      }
    });
  }

  if (req.body.project_outcomes) {
    req.body.project_outcomes.forEach((outcome, index) => {
      if (!outcome.project_title) errors.push(`project_outcomes[${index}].project_title is required`);
      if (!outcome.outcome_type) errors.push(`project_outcomes[${index}].outcome_type is required`);
      if (!outcome.role) errors.push(`project_outcomes[${index}].role is required`);
    });
  }

  if (req.body.products) {
    req.body.products.forEach((product, index) => {
      if (!product.product_name) errors.push(`products[${index}].product_name is required`);
      if (!product.type) errors.push(`products[${index}].type is required`);
    });
  }

  if (req.body.patents) {
    req.body.patents.forEach((patent, index) => {
      if (!patent.title) errors.push(`patents[${index}].title is required`);
      if (!patent.status) errors.push(`patents[${index}].status is required`);
    });
  }

  if (req.body.patent_revenue) {
    req.body.patent_revenue.forEach((rev, index) => {
      if (!rev.title) errors.push(`patent_revenue[${index}].title is required`);
      if (!rev.year) errors.push(`patent_revenue[${index}].year is required`);
      if (rev.amount !== undefined && rev.amount < 0) {
        errors.push(`patent_revenue[${index}].amount must be >= 0`);
      }
    });
  }

  if (req.body.startups) {
    req.body.startups.forEach((startup, index) => {
      if (!startup.startup_name) errors.push(`startups[${index}].startup_name is required`);
      if (!startup.role) errors.push(`startups[${index}].role is required`);
    });
  }

  if (req.body.consultancy) {
    req.body.consultancy.forEach((consult, index) => {
      if (!consult.activity_type) errors.push(`consultancy[${index}].activity_type is required`);
      if (!consult.year) errors.push(`consultancy[${index}].year is required`);
      if (consult.amount !== undefined && consult.amount < 0) {
        errors.push(`consultancy[${index}].amount must be >= 0`);
      }
    });
  }

  if (req.body.phd_supervision) {
    req.body.phd_supervision.forEach((phd, index) => {
      if (!phd.scholar_name) errors.push(`phd_supervision[${index}].scholar_name is required`);
      if (!phd.status) errors.push(`phd_supervision[${index}].status is required`);
      if (!phd.year) errors.push(`phd_supervision[${index}].year is required`);
      if (phd.status && !['ongoing', 'completed'].includes(phd.status)) {
        errors.push(`phd_supervision[${index}].status must be 'ongoing' or 'completed'`);
      }
    });
  }

  if (req.body.student_projects) {
    req.body.student_projects.forEach((proj, index) => {
      if (!proj.title) errors.push(`student_projects[${index}].title is required`);
      if (!proj.department) errors.push(`student_projects[${index}].department is required`);
      if (!proj.status) errors.push(`student_projects[${index}].status is required`);
      if (!proj.year) errors.push(`student_projects[${index}].year is required`);
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

module.exports = { validatePartC };