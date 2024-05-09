import {MicrophoneDriver} from "./MicrophoneDriver.js";
export default class MicrophoneService {
    #loggerService = null
    #gpioService = null
    #microphoneDriver = null

    constructor({gpioService, loggerService, microphoneImplementation}) {
        if(!gpioService.addActiveLine) {
            throw new Error('gpioService provided in MicrophoneService constructor has no addActiveLine method')
        }

        if(!loggerService.log) {
            throw new Error('loggerService provided in MicrophoneService constructor has no log method')
        }

        this.#gpioService = gpioService
        this.#loggerService = loggerService

        this.#microphoneDriver = new MicrophoneDriver({gpioService, loggerService, microphoneImplementation})

        this.#loggerService.log({
            level: 'info',
            message: 'MicrophoneService instance was created successfully',
        })
    }

    listen = ({
      callbackOnstartComplete = () => {},
      callbackOnError = ({error}) => {},
      callbackOnPauseComplete = () => {},
      callbackOnStopComplete = () => {},
      callbackOnSilence = () => {},
      callbackOnProcessExitComplete = () => {},
      callbackOnResumeComplete = () => {},
      callbackOnData = ({data}) => {}
    }) => {
        this.#microphoneDriver.listen({
            callbackOnstartComplete,
            callbackOnError,
            callbackOnPauseComplete,
            callbackOnStopComplete,
            callbackOnSilence,
            callbackOnProcessExitComplete,
            callbackOnResumeComplete,
            callbackOnData: ({data}) => {
                this.#loggerService.log({
                    level: 'info',
                    message: `MicrophoneService.listen -> callbackOnData data : ${data}`,
                })

                this.#loggerService.log({
                    level: 'info',
                    message: 'MicrophoneService.listen -> callbackOnData was executed successfully',
                })

                callbackOnData({data})
            },
        })

        this.#loggerService.log({
            level: 'info',
            message: 'MicrophoneService.listen was executed successfully',
        })

        return this
    }
}
