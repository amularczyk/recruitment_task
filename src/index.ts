const ServiceTypeConst = {
    Photography: "Photography",
    VideoRecording: "VideoRecording",
    BlurayPackage: "BlurayPackage",
    TwoDayEvent: "TwoDayEvent",
    WeddingSession: "WeddingSession",
}

const ServiceYearConst = {
    2020: 2020,
    2021: 2021,
    2022: 2022,
}

const PricesConst = {
    BothServicesDiscount: "BothServicesDiscount",
    WeddingSessionDiscount: "WeddingSessionDiscount"
}

const Prices: number[][] = []

const PricesFrom2020: number[] = []
Prices[ServiceYearConst[2020]] = PricesFrom2020
PricesFrom2020[ServiceTypeConst.Photography] = 1700
PricesFrom2020[ServiceTypeConst.VideoRecording] = 1700
PricesFrom2020[PricesConst.BothServicesDiscount] = 1200

const PricesFrom2021: number[] = []
Prices[ServiceYearConst[2021]] = PricesFrom2021
PricesFrom2021[ServiceTypeConst.Photography] = 1800
PricesFrom2021[ServiceTypeConst.VideoRecording] = 1800
PricesFrom2021[PricesConst.BothServicesDiscount] = 1300

const PricesFrom2022: number[] = []
Prices[ServiceYearConst[2022]] = PricesFrom2022
PricesFrom2022[ServiceTypeConst.Photography] = 1900
PricesFrom2022[ServiceTypeConst.VideoRecording] = 1900
PricesFrom2022[PricesConst.BothServicesDiscount] = 1300

const CommonPrices: number[] = []
CommonPrices[ServiceTypeConst.WeddingSession] = 600
CommonPrices[PricesConst.WeddingSessionDiscount] = 300
CommonPrices[ServiceTypeConst.BlurayPackage] = 300
CommonPrices[ServiceTypeConst.TwoDayEvent] = 400

export type ServiceYear = 2020 | 2021 | 2022
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession"

const updateForSelect = (
    previouslySelectedServices: ServiceType[],
    service: ServiceType
) => {
    if (previouslySelectedServices.find(x => x === service)) {
        return previouslySelectedServices
    }

    if (service === ServiceTypeConst.BlurayPackage 
    && !previouslySelectedServices.find(x => x === ServiceTypeConst.VideoRecording)) {
        return previouslySelectedServices
    }

    if (service === ServiceTypeConst.TwoDayEvent
    && !previouslySelectedServices.find(x => x === ServiceTypeConst.VideoRecording || x === ServiceTypeConst.Photography)) {
        return previouslySelectedServices
    }

    return [...previouslySelectedServices, service]
}

const updateForDeselect = (
    previouslySelectedServices: ServiceType[],
    service: ServiceType
) => {
    let filteredServices = previouslySelectedServices.filter(x => x !== service)
    
    if (service === ServiceTypeConst.VideoRecording
    && filteredServices.find(x => x === ServiceTypeConst.BlurayPackage)) {
        filteredServices = filteredServices.filter(x => x !== ServiceTypeConst.BlurayPackage)
    }

    if (!filteredServices.find(x => x === ServiceTypeConst.VideoRecording || x === ServiceTypeConst.Photography)
    && filteredServices.find(x => x === ServiceTypeConst.TwoDayEvent)) {
        filteredServices = filteredServices.filter(x => x !== ServiceTypeConst.TwoDayEvent)
    }

    return filteredServices
}

export const updateSelectedServices = (
    previouslySelectedServices: ServiceType[],
    action: { type: "Select" | "Deselect"; service: ServiceType }
) => {
    if (action.type === "Select") {
        return updateForSelect(previouslySelectedServices, action.service)
    }

    if (action.type === "Deselect") {
        return updateForDeselect(previouslySelectedServices, action.service)
    }
    
    return previouslySelectedServices
}

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    let basePrice = 0
    let finalPrice = 0

    const pricesForSelectedYear = Prices[selectedYear]

    const containsPhotography = selectedServices.find(x => x === ServiceTypeConst.Photography)
    const containsVideoRecording = selectedServices.find(x => x === ServiceTypeConst.VideoRecording)
    const containsBlurayPackage = selectedServices.find(x => x === ServiceTypeConst.BlurayPackage)
    const containsTwoDayEvent = selectedServices.find(x => x === ServiceTypeConst.TwoDayEvent)
    const containsWeddingSession = selectedServices.find(x => x === ServiceTypeConst.WeddingSession)

    if (containsPhotography) {
        basePrice += pricesForSelectedYear[ServiceTypeConst.Photography]
    }
    if (containsVideoRecording) {
        basePrice += pricesForSelectedYear[ServiceTypeConst.VideoRecording]
        if (containsBlurayPackage) {
            basePrice += CommonPrices[ServiceTypeConst.BlurayPackage]
        }
    }
    if (containsPhotography && containsVideoRecording) {
        finalPrice -= pricesForSelectedYear[PricesConst.BothServicesDiscount]
    }
    if (containsWeddingSession)
    {
        basePrice += CommonPrices[ServiceTypeConst.WeddingSession]
        if (containsPhotography && selectedYear === ServiceYearConst[2022]) {
            basePrice -= CommonPrices[ServiceTypeConst.WeddingSession]
            if (containsTwoDayEvent) {
                basePrice += CommonPrices[ServiceTypeConst.TwoDayEvent]
            }
        }
        else if (containsPhotography || containsVideoRecording) {
            finalPrice -= CommonPrices[PricesConst.WeddingSessionDiscount]
            if (containsTwoDayEvent) {
                basePrice += CommonPrices[ServiceTypeConst.TwoDayEvent]
            }
        }
    }    

    finalPrice += basePrice

    return { basePrice, finalPrice }
}