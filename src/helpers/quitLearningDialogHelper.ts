import { Event, QuitLearningReason } from "../types";

export function quitLearning(context: any) {
    context.$eventHub.$emit("showCustomDialog", {
      title: "Quit Learning?",
      message:
        "Do you really want to quit learning? Nevertheless, your progress is saved.",
      buttons: [
        {
          name: "Cancel",
          color: "grey"
        },
        {
          name: "Quit",
          color: "orange darken-1",
          callback: () => {
            context.$eventHub.$emit(Event.QUIT_LEARNING, QuitLearningReason.USER_ACTION);
          }
        }
      ]
    });
  }
  