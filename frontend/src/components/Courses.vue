<script setup>
import courses from "../courses.json";

const terms = ["Fall", "Spring"];
const courseYears = [...new Set(courses.map((course) => course.year))]
  .sort((a, b) => b - a)
  .map((year) => ({
    year,
    semesters: terms
      .map((term) => ({
        term,
        courses: courses.filter((course) => course.year === year && course.term === term),
      }))
      .filter((semester) => semester.courses.length),
  }));
</script>

<template>
  <div class="container mt-5" style="width: 75%">
    <div v-for="courseYear in courseYears" :key="courseYear.year" class="mb-5">
      <span style="font-size: 1.75rem; font-weight: bold">{{ courseYear.year }}</span>
      <div class="item-content mt-3">
        <template v-for="semester in courseYear.semesters" :key="semester.term">
          <span class="h5">{{ semester.term }}&nbsp;</span>
          <ul style="font-size: 1.15rem">
            <li v-for="course in semester.courses" :key="course.index">
              {{ course.name }} ({{ course.level }})
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>
