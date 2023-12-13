import UserProfile from "../views/Account/Profile";
import SchoolAdminDashboard from "../views/Admin/SchoolAdmin";
import SchoolAdminClassDetail from "../views/Admin/SchoolAdmin/Detail-class";
import AdminSettingPage from "../views/Admin/RootAdmin/Setting-Page";
import AdminSupports from "../views/Admin/RootAdmin/Support/index";
import Forgotpassword from "../views/Authetication/signin-page/base/forgotpassword";
import ResetPassword from "../views/Authetication/signin-page/base/forgotpassword/changePassword";
import SignInForm from "../views/Authetication/signin-page/base/signin-form";
import VerifyOne from "../views/Authetication/signup-page/Verify-email/verify-one";
import VerifyTwo from "../views/Authetication/signup-page/Verify-email/verify-two";
import SignupNormal from "../views/Authetication/signup-page/base/Signup-normal";
import SignupRoleCampus from "../views/Authetication/signup-page/base/Signup-role-campus";
import PageForbidden from "../views/Error/Error-403";
import PageNotFound from "../views/Error/Error-404";
import Main from "../views/main";
import StudentLessonDetail from "../views/Student/Detail-Lesson";
import StudentListLesson from "../views/Student/List-Lesson";
import Notes from "../views/Notes";
import NoteDetail from "../views/Notes/NoteDetail/index";
import StudentListSubject from "../views/Student/ListSubject";
import TeacherDetailLesson from "../views/Teacher/Detail-Lesson";
import TeacherDetailStudent from "../views/Teacher/Detail-Student";
import SubmissionDetail from "../views/Teacher/SubmissionDetail";
import TeacherListLesson from "../views/Teacher/Lesson-teacher";
import TeacherSubmissions from "../views/Teacher/List-Submissions";
import TeacherListClass from "../views/Teacher/ListClass";
import TeacherCreateLesson from "../views/Teacher/CreateLesson";
import TeacherEditLesson from "../views/Teacher/EditLesson";
import Evaluate from "../views/Teacher/Evaluate";
import Submissions from "../views/Student/Submissions";
import Library from "../views/Library";
import DetailLibrary from "../views/Library/Detail-library";
import Requests from "../views/Request";
import Campuses from "../views/Admin/RootAdmin/Campuses";
import CampusDetail from "../views/Admin/RootAdmin/Campuses/CampusDetail";
import Result from "../views/Result";

const routes = [
  {
    path: "*",
    roleTargets: ["ALL"],
    element: PageNotFound
  },
  {
    path: "/forbidden",
    roleTargets: ["ALL"],
    element: PageForbidden
  },
  {
    path: "/",
    roleTargets: ["ALL"],
    element: Main
  },
  {
    path: "/signin",
    roleTargets: ["ALL"],
    element: SignInForm
  },
  {
    path: "/signup",
    roleTargets: ["ALL"],
    element: SignupNormal
  },
  {
    path: "/signup-role-campus",
    roleTargets: ["ALL"],
    element: SignupRoleCampus
  },
  {
    path: "/check-email",
    roleTargets: ["ALL"],
    element: VerifyOne
  },
  {
    path: "/verify-account",
    roleTargets: ["ALL"],
    element: VerifyTwo
  },
  {
    path: "/forgot-password",
    roleTargets: ["ALL"],
    element: Forgotpassword
  },
  {
    path: "/reset-password",
    roleTargets: ["ALL"],
    element: ResetPassword
  },
  {
    path: "/student/subjects",
    roleTargets: ["STUDENT"],
    element: StudentListSubject
  },
  {
    path: "/library",
    roleTargets: ["STUDENT", "TEACHER"],
    element: Library
  },
  {
    path: "/library/detail",
    roleTargets: ["STUDENT", "TEACHER"],
    element: DetailLibrary
  },
  {
    path: "/student/lessons",
    roleTargets: ["STUDENT"],
    element: StudentListLesson
  },
  {
    path: "/student/lessons/detail",
    roleTargets: ["STUDENT"],
    element: StudentLessonDetail
  },
  {
    path: "/submissions",
    roleTargets: ["STUDENT"],
    element: Submissions
  },
  {
    path: "/notes",
    roleTargets: ["STUDENT", "TEACHER"],
    element: Notes
  },
  {
    path: "/requests",
    roleTargets: ["STUDENT", "TEACHER", "SCHOOL_ADMIN"],
    element: Requests
  },
  {
    path: "/notes/detail",
    roleTargets: ["STUDENT", "TEACHER"],
    element: NoteDetail
  },
  {
    path: "/teacher/classes",
    roleTargets: ["TEACHER"],
    element: TeacherListClass
  },
  {
    path: "/teacher/classes/list-student/detail-student",
    roleTargets: ["TEACHER"],
    element: TeacherDetailStudent
  },
  {
    path: "/teacher/classes/lessons",
    roleTargets: ["TEACHER"],
    element: TeacherListLesson
  },
  {
    path: "/teacher/submissions",
    roleTargets: ["TEACHER"],
    element: TeacherSubmissions
  },
  {
    path: "/teacher/lessons/create",
    roleTargets: ["TEACHER"],
    element: TeacherCreateLesson
  },
  {
    path: "/teacher/lessons/edit",
    roleTargets: ["TEACHER"],
    element: TeacherEditLesson
  },
  {
    path: "/teacher/lessons/detail",
    roleTargets: ["TEACHER"],
    element: TeacherDetailLesson
  },
  {
    path: "/submissions/detail",
    roleTargets: ["TEACHER", "STUDENT"],
    element: SubmissionDetail
  },
  {
    path: "/teacher/evaluate",
    roleTargets: ["TEACHER"],
    element: Evaluate
  },
  {
    path: "/results",
    roleTargets: ["TEACHER"],
    element: Result
  },
  {
    path: "/profile",
    roleTargets: ["USER"],
    element: UserProfile
  },
  {
    path: "/supports",
    roleTargets: ["ROOT_ADMIN"],
    element: AdminSupports
  },
  {
    path: "/school-admin",
    roleTargets: ["SCHOOL_ADMIN"],
    element: SchoolAdminDashboard
  },
  {
    path: "/school-admin/classes/detail",
    roleTargets: ["SCHOOL_ADMIN"],
    element: SchoolAdminClassDetail
  },
  {
    path: "/setting",
    roleTargets: ["ROOT_ADMIN"],
    element: AdminSettingPage
  },
  {
    path: "/campuses",
    roleTargets: ["ROOT_ADMIN"],
    element: Campuses
  },
  {
    path: "/campuses/detail",
    roleTargets: ["ROOT_ADMIN"],
    element: CampusDetail
  }
];

export default routes;
