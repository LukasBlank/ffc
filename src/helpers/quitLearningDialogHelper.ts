import {
  Event,
  QuitLearningReason,
  CustomDialogOptionsBarChartBar,
} from '../types'
import { clearLearningSessionManagerDataInLocalStorage } from './learningSessionStorageHelper'
import { addPoints } from './studyGroupHelper'

export function quitLearningDialog(
  context: any,
  bars: CustomDialogOptionsBarChartBar[],
  groupID: string | undefined,
  stars: number
) {
  context.$eventHub.$emit('showCustomDialog', {
    title: 'Quit Learning?',
    message:
      'Do you really want to quit learning? Nevertheless, your progress is saved.',
    barChart: {
      bars,
    },
    buttons: [
      {
        name: 'Cancel',
        color: 'grey',
      },
      {
        name: 'Quit',
        color: 'orange darken-1',
        callback: async () => {
          await addPoints(groupID || '', stars)
          context.$eventHub.$emit(
            Event.QUIT_LEARNING,
            QuitLearningReason.USER_ACTION,
            groupID
          )
          clearLearningSessionManagerDataInLocalStorage()
        },
      },
    ],
  })
}
