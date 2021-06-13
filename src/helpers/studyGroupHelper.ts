import firebase from 'firebase'
import { get, set } from './localStorageHelper'
import { StudyGroup, Deck } from '../types'

export async function signInToFirebase(): Promise<void> {
  try {
    if (!get('uid')) {
      const userCredentials: firebase.auth.UserCredential = await firebase
        .auth()
        .signInAnonymously()
      set('uid', userCredentials.user?.uid || '')
    }
  } catch (error) {
    console.log(error)
  }
}

export async function getStudyGroups(): Promise<StudyGroup[]> {
  try {
    const query: firebase.firestore.QuerySnapshot<firebase.firestore.DocumentData> = await firebase
      .firestore()
      .collection('groups')
      .get()
    const groups: StudyGroup[] = query.docs.map((doc) => {
      return {
        name: doc.get('name'),
        id: doc.id,
        owner: doc.get('owner'),
        members: doc.get('members'),
        decks: doc.get('decks'),
      }
    })
    return groups.filter(
      (group) => group.members[get('uid')] || group.owner == get('uid')
    )
  } catch (error) {
    console.log(error)
    return []
  }
}

export async function createStudyGroup(
  name: string,
  username: string,
  decks: Deck[]
): Promise<string | null> {
  try {
    const ref: firebase.firestore.DocumentReference<firebase.firestore.DocumentData> = await firebase
      .firestore()
      .collection('groups')
      .add({
        name: name,
        members: {
          [get('uid')]: { name: username, score: 0 },
        },
        owner: get('uid'),
        decks: decks,
      })
    return ref.id
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function joinStudyGroup(
  id: string,
  username: string
): Promise<string | null> {
  try {
    const doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> = await firebase
      .firestore()
      .doc('groups/' + id)
      .get()
    if (doc.exists) {
      await doc.ref.update({
        ['members.' + get('uid')]: { name: username, score: 0 },
      })
      return id
    } else return null
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function getStudyGroup(id: string): Promise<StudyGroup | null> {
  try {
    const doc: firebase.firestore.DocumentSnapshot<firebase.firestore.DocumentData> = await firebase
      .firestore()
      .doc('groups/' + id)
      .get()
    const group: StudyGroup = {
      id: doc.id,
      name: doc.get('name'),
      owner: doc.get('owner'),
      members: doc.get('members'),
      decks: doc.get('decks'),
    }
    return group
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function removeUserFromGroup(
  id: string,
  member_id: string
): Promise<StudyGroup | null> {
  try {
    await firebase
      .firestore()
      .doc('groups/' + id)
      .update({
        ['members.' + member_id]: firebase.firestore.FieldValue.delete(),
      })
    return await getStudyGroup(id)
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function addPoints(id: string, points: number): Promise<void> {
  try {
    await firebase
      .firestore()
      .doc('groups/' + id)
      .update({
        ['members.' +
        get('uid') +
        '.score']: firebase.firestore.FieldValue.increment(points),
      })
  } catch (error) {
    console.log(error)
  }
}
