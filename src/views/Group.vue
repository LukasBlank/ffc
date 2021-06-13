<template>
  <div
    v-if="loading"
    style="display:flex; justify-content: center; padding: 20px;"
  >
    <v-progress-circular indeterminate color="primary"></v-progress-circular>
  </div>
  <div v-else>
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab>Group</v-tab>
      <v-tab>Ranking</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <div style="display: flex; flex-direction: column;  padding: 20px">
          <v-text-field
            style="width: 100%"
            :value="studyGroup.name"
            outlined
            readonly
            label="Group-Name"
          ></v-text-field>
          <v-text-field
            style="width: 100%"
            :value="studyGroup.id"
            id="groupID"
            outlined
            readonly
            label="Group-ID"
          >
            <v-icon @click="copy" slot="append">mdi-content-copy</v-icon>
          </v-text-field>
          <div v-if="studyGroup.owner == uid">
            <v-subheader>Mitglieder</v-subheader>
            <v-list>
              <v-list-item
                v-for="(member, index) in studyGroup.members"
                :key="index"
                dense
              >
                <v-list-item-content>
                  <v-list-item-title v-text="member.name"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon
                  ><v-icon
                    v-if="index != studyGroup.owner"
                    @click="deleteMember(index)"
                    >mdi-delete</v-icon
                  ><v-icon v-else>mdi-lock-outline</v-icon></v-list-item-icon
                >
              </v-list-item>
            </v-list>
            <v-dialog v-model="deleteMemberDialog" persistent>
              <v-card color="#2e2e2e">
                <v-card-title>Remove member</v-card-title>
                <v-card-text>
                  Removing this user will irrevocably delete his score and
                  remove him from this group. Are you sure you want to continue?
                </v-card-text>
                <v-card-actions>
                  <v-btn @click="cancelDelete">Cancel</v-btn>
                  <v-btn @click="continueDelete">Continue</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
          <v-subheader>Decks</v-subheader>
          <v-list>
            <v-list-item
              v-for="(deck, index) in studyGroup.decks"
              :key="index"
              dense
            >
              <v-list-item-content>
                <v-list-item-title v-text="deck.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-btn
            class="mx-2"
            id="btn-fixed-bottom-right-corner"
            fab
            dark
            color="indigo"
            :to="'/learn/' + $route.params.id"
          >
            <v-icon>mdi-navigation</v-icon>
          </v-btn>
        </div>
      </v-tab-item>
      <v-tab-item>
        <div style="display: flex; flex-direction: column;  padding: 20px">
          <v-list>
            <v-list-item v-for="(member, index) in sortedMembers" :key="index">
              <v-list-item-content>
                <div
                  style="display: flex; justify-content: space-between; align-items: center; width: 100%"
                >
                  <div style="width: 13%; text-align: center;">
                    <div style="font-size: 20px" v-if="index > 2">
                      {{ index + 1 }}.
                    </div>
                    <v-img :src="getImage(index)" v-else contain></v-img>
                  </div>
                  <div style="width: 70%; text-align: center">
                    {{ member.name }}
                  </div>
                  <div
                    style="width: 17%; display: flex; flex-direction: column; align-items: center"
                  >
                    <div style="font-size: 20px">
                      {{ member.score }}
                    </div>
                    <div style="font-size: 11px">points</div>
                  </div>
                </div>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </div>
      </v-tab-item>
    </v-tabs-items>
    <v-snackbar v-model="showSnackbar" timeout="1000" rounded="pill"
      >ID kopiert.</v-snackbar
    >
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { getStudyGroup, removeUserFromGroup } from '../helpers/studyGroupHelper'
import { StudyGroup, Deck } from '@/types'
import { get } from '../helpers/localStorageHelper'

const GroupProps = Vue.extend({
  props: {
    decks: { type: Array as () => Deck[] },
    numberOfSelectedDecks: Number,
    cardLimit: String,
  },
})

@Component
export default class Group extends GroupProps {
  loading = true
  studyGroup: StudyGroup | null = null
  tab = 0
  showSnackbar = false
  deleteMemberDialog = false
  deleteUser = ''
  uid: string = get('uid')

  async created(): Promise<void> {
    this.studyGroup = await getStudyGroup(this.$route.params.id)
    if (!this.studyGroup) this.$router.push('/groups')
    else {
      this.studyGroup.decks.forEach((cd) => {
        if (!this.decks.find((ccd) => ccd.id == cd.id)) this.decks.push(cd)
      })
      this.decks.forEach((deck) => {
        deck.selected = this.studyGroup?.decks.find((d) => d.id == deck.id)
          ? true
          : false
      })
    }
    this.loading = false
  }

  get sortedMembers() {
    const scores: { name: string; id: string; score: number }[] = []
    for (const id in this.studyGroup?.members) {
      scores.push({
        id: id,
        name: this.studyGroup?.members[id]?.name || '',
        score: this.studyGroup?.members[id]?.score || 0,
      })
    }
    scores.sort((a, b) => b.score - a.score)
    return scores
  }
  copy(): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const element: Element | null = document.querySelector('#groupID')
    eval('element.select()')
    document.execCommand('copy')
    this.showSnackbar = true
  }
  deleteMember(uid: string): void {
    this.deleteMemberDialog = true
    this.deleteUser = uid
  }
  cancelDelete(): void {
    this.deleteMemberDialog = false
    this.deleteUser = ''
  }
  async continueDelete(): Promise<void> {
    this.deleteMemberDialog = false
    this.studyGroup = await removeUserFromGroup(
      this.$route.params.id,
      this.deleteUser
    )
    this.deleteUser = ''
  }
  getImage(index: number): any {
    const images: __WebpackModuleApi.RequireContext = require.context(
      '../assets/',
      false,
      /\.png$/
    )
    return images('./place' + (index + 1) + '.png')
  }
}
</script>
<style scoped>
#btn-fixed-bottom-right-corner {
  position: fixed;
  bottom: 20px;
  right: 20px;
  margin: 0 !important;
  -webkit-transform: rotate(90deg);
  -moz-transform: rotate(90deg);
  -ms-transform: rotate(90deg);
  -o-transform: rotate(90deg);
  transform: rotate(90deg);
}
</style>
