import { ServiceType, ServiceTypeConst } from "../types";
import { ICalculatePrice } from "./types";

export class PriceCalculatorFor2022 implements ICalculatePrice {
  photographyPrice: number = 1900
  videoRecordingPrice: number = 1900
  bothServicesDiscount: number = 1300
  weddingSessionPrice: number = 600
  weddingSessionDiscount: number = 300
  blurayPackagePrice: number = 300
  TwoDayEventPrice: number = 400
    
  public calculatePrice(selectedServices: ServiceType[]) {
    let basePrice: number = 0
    let finalPrice: number = 0

    const containsPhotography = selectedServices.find(x => x === ServiceTypeConst.Photography)
    const containsVideoRecording = selectedServices.find(x => x === ServiceTypeConst.VideoRecording)
    const containsBlurayPackage = selectedServices.find(x => x === ServiceTypeConst.BlurayPackage)
    const containsTwoDayEvent = selectedServices.find(x => x === ServiceTypeConst.TwoDayEvent)
    const containsWeddingSession = selectedServices.find(x => x === ServiceTypeConst.WeddingSession)

    if (containsPhotography) {
        basePrice += this.photographyPrice
    }
    if (containsVideoRecording) {
        basePrice += this.videoRecordingPrice
        if (containsBlurayPackage) {
            basePrice += this.blurayPackagePrice
        }
    }
    if (containsPhotography && containsVideoRecording) {
        finalPrice -= this.bothServicesDiscount
    }
    if (containsWeddingSession)
    {
        basePrice += this.weddingSessionPrice
        if (containsPhotography) {
            basePrice -= this.weddingSessionPrice
            if (containsTwoDayEvent) {
                basePrice += this.TwoDayEventPrice
            }
        }
        else if (containsVideoRecording) {
            finalPrice -= this.weddingSessionDiscount
            if (containsTwoDayEvent) {
                basePrice += this.TwoDayEventPrice
            }
        }
    }
    
    finalPrice += basePrice

    return { basePrice, finalPrice }
  }
}