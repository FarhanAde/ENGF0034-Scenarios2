const API_BASE_URL = 'http://localhost:5000';

const API = {
  baseUrl: API_BASE_URL,
  endpoints: {
    leaderboard: '/getLeaderboard',
    lessons: '/getLessons',
    lessonDetails: '/getLessonDetails',
    homework: '/getHomework',
    homeworkDetails: '/getHomeworkDetails'
  },
  getUrl: function(endpoint) {
    return `${this.baseUrl}${endpoint}`;
  }
};

export default API;