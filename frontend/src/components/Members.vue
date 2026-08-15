<script>
import members from "../members.json";

export default {
  data() {
    return { members };
  },
  computed: {
    groups() {
      return [...new Set(this.members.people.map((person) => person.group))].map((name) => ({
        name,
        people: this.members.people.filter((person) => person.group === name),
      }));
    },
  },
  methods: {
    initials(name) {
      return String(name || "")
        .split(/\s+/)
        .filter(Boolean)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    },
  },
};
</script>

<template>
  <div>
    <div v-for="group in groups" :key="group.name" class="container mt-5" style="width: 50%">
      <div class="row-cols-2 center-on-mobile"><span style="letter-spacing: normal"><span style="font-size: 1.5rem">{{ group.name }}</span></span></div>
      <div class="row row-cols-10">
        <div v-for="person in group.people" :key="person.index" class="col-12 col-md-3 col-sm-6 text-center">
          <img v-if="person.image" class="rounded-circle mt-3 memberImage" fetchpriority="high" :src="person.image" :alt="person.name" />
          <div v-else class="rounded-circle mt-3 memberImage member-placeholder" role="img" :aria-label="`${person.name} profile photo pending`">{{ initials(person.name) }}</div>
          <div class="text-center mt-1">
            <p class="member_name" style="font-size: 1rem; margin: 0">{{ person.name }}</p>
            <p class="member_name" style="font-size: 1rem; margin: 0">{{ person.nameKo }}</p>
            <p v-if="person.note" style="font-size: 0.65rem; margin: 0"><b>{{ person.note }}</b></p>
          </div>
          <div class="mt-1">
            <a v-if="person.email" type="button" class="btn btn-circle btn-dark" :href="`mailto: ${person.email}`" target="_blank"><font-awesome-icon icon="fa-solid fa-envelope" size="lg" /></a>
            <span v-if="person.email && person.link">&nbsp;</span>
            <a v-if="person.link" type="button" class="btn btn-circle btn-dark" :href="person.link" target="_blank"><font-awesome-icon icon="fa-solid fa-link" size="lg" /></a>
          </div>
        </div>
      </div>
    </div>

    <div class="container mt-5" style="width: 50%">
      <div class="row-cols-2"><span style="letter-spacing: normal"><span style="font-size: 1.5rem">Alumni</span></span></div>
      <div class="mt-2 mb-5">
        <p v-for="person in members.alumni" :key="person.index" style="font-size: 0.9rem; margin: 0">
          <span class="alumni_name"><a v-if="person.link" class="alumni_link" :href="person.link" target="_blank">{{ person.name }}</a><template v-else>{{ person.name }}</template></span>
          &nbsp;|&nbsp; {{ person.description }}
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.memberImage { width: 85%; object-fit: fill; }.member-placeholder { align-items: center; aspect-ratio: 1; background: #e7eef7; color: #294d78; display: flex; font-size: 1.6rem; font-weight: 700; justify-content: center; margin-left: auto; margin-right: auto; }.member_name, .alumni_name { font-weight: bold; }.btn-circle { width: 30px; height: 30px; text-align: center; padding: 6px 0; font-size: 12px; line-height: 1.428571429; border-radius: 15px; }.alumni_link { color: rgba(115, 177, 235); font-weight: bold; }
@media (max-width: 768px) { .container { width: 100% !important; padding-left: 15px; padding-right: 15px; }.memberImage { width: 50%; }.center-on-mobile { text-align: center; } }
</style>
