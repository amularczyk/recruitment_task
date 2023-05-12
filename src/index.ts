import { getCorrectPriceCalculator } from './PriceCalculations/priceCalculatorStrategy'
import { ServiceYear, ServiceType, ServiceTypeConst } from './types'

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
    const priceCalcualtor = getCorrectPriceCalculator(selectedYear)
    return priceCalcualtor.calculatePrice(selectedServices)
}