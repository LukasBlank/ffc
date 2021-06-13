import {
  Event,
  QuitLearningReason,
  CustomDialogOptions,
  CustomDialogOptionsBarChartBar,
} from '../types'

import { clearLearningSessionManagerDataInLocalStorage } from './learningSessionStorageHelper'
import { addPoints } from './studyGroupHelper'

export function finishLearningDialog(
  context: any,
  bars: CustomDialogOptionsBarChartBar[],
  callbackLearningFinished: { (): void },
  groupID: string | undefined,
  stars: number
) {
  const options = {
    title: 'Finish Learning?',
    message:
      'You just finished your learning session. Do you want to finish and go to the deck selection?',
    barChart: {
      bars,
    },
    buttons: [
      {
        name: 'Review Cards',
        color: 'grey',
      },
      {
        name: 'Finish',
        color: 'indigo',
        callback: async () => {
          await addPoints(groupID || '', stars)
          context.$eventHub.$emit(
            Event.QUIT_LEARNING,
            QuitLearningReason.NO_MORE_CARDS,
            groupID
          )
          clearLearningSessionManagerDataInLocalStorage()
          callbackLearningFinished()
        },
      },
    ],
  } as CustomDialogOptions
  context.$eventHub.$emit(Event.SHOW_CUSTOM_DIALOG, options)
}
