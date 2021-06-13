<template>
  <div class="AddGroup">
    <v-tabs v-model="tab" fixed-tabs>
      <v-tab>Create</v-tab>
      <v-tab>Join</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item>
        <div
          style="displax: flex; flex-direction: column; align-items: center; padding: 20px; text-align: center"
        >
          <v-text-field
            v-model="groupname"
            outlined
            clearable
            label="Provide a Group-Name"
          ></v-text-field>
          <v-text-field
            v-model="username"
            outlined
            clearable
            label="Provide a username"
          ></v-text-field>
          <DeckSelection
            :decks="decks"
            :numberOfSelectedDecks="numberOfSelectedDecks"
            :studyGroup="true"
          ></DeckSelection>
          <v-btn
            :disabled="numberOfSelectedDecks == 0 || !groupname || !username"
            @click="createDeck"
            color="indigo"
            >Create</v-btn
          >
        </div>
      </v-tab-item>
      <v-tab-item>
        <div
          style="displax: flex; flex-direction: column; align-items: center; padding: 20px; text-align: center"
        >
          <v-text-field
            v-model="groupID"
            outlined
            clearable
            label="Provide a Group-ID"
          ></v-text-field>
          <v-text-field
            v-model="username"
            outlined
            clearable
            label="Provide a username"
          ></v-text-field>
          <v-btn
            :disabled="!username || !groupID"
            @click="joinGroup"
            color="indigo"
            >Join</v-btn
          >
        </div>
      </v-tab-item>
    </v-tabs-items>
    <v-snackbar v-model="showSnackbar" timeout="2000" rounded="pill"
      >Invalid Group-ID.</v-snackbar
    >
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { createStudyGroup, joinStudyGroup } from '../helpers/studyGroupHelper'
import DeckSelection from '../components/deckselection/DeckSelection.vue'
import { Deck } from '../types'
const AddGroupProps = Vue.extend({
  props: {
    decks: { type: Array as () => Deck[] },
    numberOfSelectedDecks: Number,
  },
})
@Component({
  components: { DeckSelection },
})
export default class AddGroup extends AddGroupProps {
  tab = 0
  groupname = ''
  username = ''
  groupID = ''
  showSnackbar = false
  async createDeck(): Promise<void> {
    if (this.groupname) {
      const res: string | null = await createStudyGroup(
        this.groupname,
        this.username,
        this.decks.filter((deck) => deck.selected)
      )
      if (res) this.$router.push('/group/' + res)
    }
  }
  async joinGroup(): Promise<void> {
    if (this.groupID) {
      const res: string | null = await joinStudyGroup(
        this.groupID,
        this.username
      )
      if (res) this.$router.push('/group/' + res)
      else {
        this.groupID = ''
        this.showSnackbar = true
      }
    }
  }
}
</script>
