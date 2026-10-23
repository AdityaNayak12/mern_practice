import mongoose from "mongoose";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const toggleEnrollment = async (req, res) => {
  try {
    const { courseId } = req.params;
    const studentId = req.user._id;

    // STEP 1: Validate courseId.
    if (!mongoose.isObjectIdOrHexString(courseId)) {
      return res.status(400).json({ message: "Invalid CourseId" });
    }
    // STEP 2: Find the course.
    const course = await Course.findById(courseId);
    // STEP 3: Find the student.
    const student = await User.findById(studentId);
    // STEP 4: Handle missing records.
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    // STEP 5: Check whether the student is already enrolled.
    const alreadyEnrolled = course.students.some((id) =>
      id.equals(student._id),
    );
    if (alreadyEnrolled) {
      course.students = course.students.filter((id) => !id.equals(student._id));

      student.enrolledCourses = student.enrolledCourses.filter(
        (id) => !id.equals(course._id),
      );

      await course.save();
      await student.save();

      return res.status(200).json({
        success: true,
        enrolled: false,
        message: "Withdrawn from course successfully",
      });
    }

    // STEP 6: Enroll or withdraw in both documents.
    if (course.students.length >= course.capacity) {
      return res.status(400).json({
        success: false,
        message: "Course is full",
      });
    }
    course.students.push(student._id);
    student.enrolledCourses.push(course._id);
    // STEP 7: Save both documents.
    await course.save();
    await student.save();
    // STEP 8: Return the response.
    return res.status(200).json({
      success: true,
      enrolled: true,
      message: "Enrolled in course successfully",
    });

    return res
      .status(501)
      .json({ success: false, message: "Finish toggleEnrollment" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
