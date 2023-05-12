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

const PhotographyPrices: number[] = []
PhotographyPrices[ServiceYearConst[2020]] = 1700
PhotographyPrices[ServiceYearConst[2021]] = 1800
PhotographyPrices[ServiceYearConst[2022]] = 1900

const VideoRecordingPrices: number[] = []
VideoRecordingPrices[ServiceYearConst[2020]] = 1700
VideoRecordingPrices[ServiceYearConst[2021]] = 1800
VideoRecordingPrices[ServiceYearConst[2022]] = 1900

const BothServicesDiscount: number[] = []
BothServicesDiscount[ServiceYearConst[2020]] = 1200
BothServicesDiscount[ServiceYearConst[2021]] = 1300
BothServicesDiscount[ServiceYearConst[2022]] = 1300

export type ServiceYear = 2020 | 2021 | 2022;
export type ServiceType = "Photography" | "VideoRecording" | "BlurayPackage" | "TwoDayEvent" | "WeddingSession";

const updateForSelect = (
    previouslySelectedServices: ServiceType[],
    service: ServiceType
) => {
    if (previouslySelectedServices.find(x => x === service)) {
        return previouslySelectedServices;
    }

    if (service === ServiceTypeConst.BlurayPackage 
    && !previouslySelectedServices.find(x => x === ServiceTypeConst.VideoRecording)) {
        return previouslySelectedServices;
    }

    if (service === ServiceTypeConst.TwoDayEvent
    && !previouslySelectedServices.find(x => x === ServiceTypeConst.VideoRecording || x === ServiceTypeConst.Photography)) {
        return previouslySelectedServices;
    }

    return [...previouslySelectedServices, service];
}

const updateForDeselect = (
    previouslySelectedServices: ServiceType[],
    service: ServiceType
) => {
    let filteredServices = previouslySelectedServices.filter(x => x !== service);
    
    if (service === ServiceTypeConst.VideoRecording
    && filteredServices.find(x => x === ServiceTypeConst.BlurayPackage)) {
        filteredServices = filteredServices.filter(x => x !== ServiceTypeConst.BlurayPackage);
    }

    if (!filteredServices.find(x => x === ServiceTypeConst.VideoRecording || x === ServiceTypeConst.Photography)
    && filteredServices.find(x => x === ServiceTypeConst.TwoDayEvent)) {
        filteredServices = filteredServices.filter(x => x !== ServiceTypeConst.TwoDayEvent);
    }

    return filteredServices;
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
    
    return previouslySelectedServices;
};

export const calculatePrice = (selectedServices: ServiceType[], selectedYear: ServiceYear) => {
    let basePrice = 0;
    let finalPrice = 0;

    const containsPhotography = selectedServices.find(x => x === ServiceTypeConst.Photography);
    const containsVideoRecording = selectedServices.find(x => x === ServiceTypeConst.VideoRecording);
    const containsBlurayPackage = selectedServices.find(x => x === ServiceTypeConst.BlurayPackage);
    const containsTwoDayEvent = selectedServices.find(x => x === ServiceTypeConst.TwoDayEvent);
    const containsWeddingSession = selectedServices.find(x => x === ServiceTypeConst.WeddingSession);

    if (containsPhotography) {
        basePrice += PhotographyPrices[selectedYear]
    }
    if (containsVideoRecording) {
        basePrice += VideoRecordingPrices[selectedYear]
        if (containsBlurayPackage) {
            basePrice += 300
        }
    }
    if (containsPhotography && containsVideoRecording) {
        finalPrice -= BothServicesDiscount[selectedYear]
    }
    if (containsWeddingSession)
    {
        basePrice += 600;
        if (containsPhotography && selectedYear === ServiceYearConst[2022]) {
            finalPrice -= 600;
            if (containsTwoDayEvent) {
                basePrice += 400
            }
        }
        else if (containsPhotography || containsVideoRecording) {
            finalPrice -= 300;
            if (containsTwoDayEvent) {
                basePrice += 400
            }
        }
    }    

    finalPrice += basePrice

    return { basePrice, finalPrice };
};