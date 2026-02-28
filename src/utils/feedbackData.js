const STORAGE_KEYS = {
  users: "users",
  forms: "forms",
  responses: "responses",
  analytics: "analyticsByForm",
};

const DEFAULT_USERS = [
  {
    name: "System Admin",
    email: "admin@college.edu",
    password: "Admin@123",
    role: "admin",
    registerNo: "ADM001",
    department: "Administration",
  },
  {
    name: "Faculty One",
    email: "faculty1@college.edu",
    password: "Faculty@123",
    role: "faculty",
    registerNo: "FAC001",
    department: "Computer Science",
  },
  {
    name: "Faculty Two",
    email: "faculty2@college.edu",
    password: "Faculty@123",
    role: "faculty",
    registerNo: "FAC002",
    department: "Electronics",
  },
  {
    name: "Student Demo",
    email: "student1@college.edu",
    password: "Student@123",
    role: "student",
    registerNo: "STU001",
    department: "Computer Science",
  },
];

const read = (key, fallback = []) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const initializeFeedbackData = () => {
  const users = read(STORAGE_KEYS.users, []);
  if (!users.length) {
    write(STORAGE_KEYS.users, DEFAULT_USERS);
  } else {
    const mergedUsers = [...users];
    DEFAULT_USERS.forEach((seedUser) => {
      const index = mergedUsers.findIndex((user) => user.email === seedUser.email);
      if (index === -1) {
        mergedUsers.push(seedUser);
      } else {
        mergedUsers[index] = {
          ...mergedUsers[index],
          role: seedUser.role,
        };
      }
    });
    write(STORAGE_KEYS.users, mergedUsers);
  }

  if (!localStorage.getItem(STORAGE_KEYS.forms)) {
    write(STORAGE_KEYS.forms, []);
  }

  if (!localStorage.getItem(STORAGE_KEYS.responses)) {
    write(STORAGE_KEYS.responses, []);
  }

  if (!localStorage.getItem(STORAGE_KEYS.analytics)) {
    write(STORAGE_KEYS.analytics, {});
  }
};

export const getUsers = () => read(STORAGE_KEYS.users, []);
export const saveUsers = (users) => write(STORAGE_KEYS.users, users);

export const getForms = () => read(STORAGE_KEYS.forms, []);
export const saveForms = (forms) => write(STORAGE_KEYS.forms, forms);

export const getResponses = () => read(STORAGE_KEYS.responses, []);
export const saveResponses = (responses) => write(STORAGE_KEYS.responses, responses);

export const getFacultyUsers = () =>
  getUsers().filter((user) => user.role === "faculty");

export const addFacultyUser = ({ name, email, password, department }) => {
  const users = getUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const exists = users.some((user) => user.email === normalizedEmail);
  if (exists) {
    return { ok: false, message: "Faculty with this email already exists." };
  }

  const registerNo = `FAC${String(Date.now()).slice(-6)}`;
  const nextUsers = [
    ...users,
    {
      name: name.trim(),
      email: normalizedEmail,
      password,
      role: "faculty",
      registerNo,
      department: department.trim(),
    },
  ];

  saveUsers(nextUsers);
  return { ok: true };
};

export const removeFacultyUser = (email) => {
  const users = getUsers();
  const nextUsers = users.filter(
    (user) => !(user.role === "faculty" && user.email === email)
  );

  const forms = getForms();
  const nextForms = forms.map((form) => ({
    ...form,
    assignedFacultyEmails: (form.assignedFacultyEmails || []).filter(
      (facultyEmail) => facultyEmail !== email
    ),
  }));

  saveUsers(nextUsers);
  saveForms(nextForms);
  refreshAnalyticsData();
};

export const createFeedbackForm = (payload) => {
  const forms = getForms();
  const newForm = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    ...payload,
  };

  saveForms([...forms, newForm]);
  refreshAnalyticsData();
  return newForm;
};

export const getStudentForms = () =>
  getForms().filter((form) => form.published);

export const getFacultyAssignedForms = (facultyEmail) =>
  getForms().filter((form) =>
    (form.assignedFacultyEmails || []).includes(facultyEmail)
  );

export const submitFormResponse = (responsePayload) => {
  const responses = getResponses();
  const updatedResponses = [
    ...responses,
    {
      id: Date.now(),
      submittedAt: new Date().toISOString(),
      ...responsePayload,
    },
  ];

  saveResponses(updatedResponses);
  refreshAnalyticsData();
};

export const hasStudentSubmitted = (formId, studentEmail) =>
  getResponses().some(
    (response) => response.formId === formId && response.submittedBy === studentEmail
  );

export const computeFormAnalytics = (form, responses) => {
  const responseCount = responses.length;

  const ratingQuestions = (form.questions || []).filter(
    (question) => question.type === "rating"
  );

  const questionAverages = (form.questions || []).map((question, questionIndex) => {
    if (question.type !== "rating") {
      return {
        question: question.question,
        type: question.type,
        average: null,
      };
    }

    const values = responses
      .map((response) => response.answers?.[questionIndex])
      .filter((value) => typeof value === "number" && value > 0);

    const average = values.length
      ? Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2))
      : 0;

    return {
      question: question.question,
      type: question.type,
      average,
    };
  });

  const overallRatingValues = questionAverages
    .filter((item) => item.type === "rating")
    .map((item) => item.average)
    .filter((value) => typeof value === "number");

  const overallRating = overallRatingValues.length
    ? Number(
        (
          overallRatingValues.reduce((sum, value) => sum + value, 0) /
          overallRatingValues.length
        ).toFixed(2)
      )
    : 0;

  const scaleMax = form.ratingScaleMax || 5;
  const ratingScale = Array.from({ length: scaleMax }, (_, index) => index + 1);

  const responseDistribution = ratingScale.map((ratingPoint) => {
    let count = 0;

    responses.forEach((response) => {
      (form.questions || []).forEach((question, questionIndex) => {
        if (question.type !== "rating") return;
        if (response.answers?.[questionIndex] === ratingPoint) {
          count += 1;
        }
      });
    });

    return {
      rating: `${ratingPoint} Star`,
      count,
    };
  });

  return {
    formId: form.id,
    ratingScaleMax: scaleMax,
    totalSubmissions: responseCount,
    averagePerQuestion: questionAverages,
    overallRating,
    distribution: responseDistribution,
    lastUpdated: new Date().toISOString(),
  };
};

export const refreshAnalyticsData = () => {
  const forms = getForms();
  const responses = getResponses();
  const analyticsByForm = {};

  forms.forEach((form) => {
    const formResponses = responses.filter((response) => response.formId === form.id);
    analyticsByForm[form.id] = computeFormAnalytics(form, formResponses);
  });

  write(STORAGE_KEYS.analytics, analyticsByForm);
  return analyticsByForm;
};

export const getAnalyticsByForm = () => {
  const analytics = read(STORAGE_KEYS.analytics, {});
  if (!Object.keys(analytics).length) {
    return refreshAnalyticsData();
  }
  return analytics;
};
