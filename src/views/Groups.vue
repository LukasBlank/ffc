<template>
  <div class="StudyGroups">
    <div
      v-if="loading"
      style="display:flex; justify-content: center; padding: 20px;"
    >
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <div v-else>
      <v-subheader>Study Groups</v-subheader>
      <v-list v-if="groups.length > 0">
        <v-list-item
          v-for="(group, index) in groups"
          :key="index"
          :to="'group/' + group.id"
        >
          <v-list-item-content>
            <v-list-item-title v-text="group.name"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <p v-else style="padding: 0 16px;">
        You don't have any study groups yet. You might want to add one by
        clicking on the button in the bottom right corner.
      </p>
      <v-btn
        class="mx-2"
        id="btn-fixed-bottom-right-corner"
        fab
        dark
        color="indigo"
        to="add/group"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getStudyGroups } from '../helpers/studyGroupHelper'
import { StudyGroup } from '../types'

@Component
export default class Groups extends Vue {
  groups: StudyGroup[] = []
  loading = true
  async created(): Promise<void> {
    this.groups = await getStudyGroups()
    this.loading = false
  }
}
</script>
<style scoped>
#btn-fixed-bottom-right-corner {
  position: fixed;
  bottom: 20px;
  right: 20px;
  margin: 0 !important;
}
</style>
