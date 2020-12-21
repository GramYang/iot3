import defaultSettings from '@/const/settings'

const title=defaultSettings.title

export default function getPageTile(pageTitle) {
    if(pageTitle){
        return `${pageTitle} - ${title}`
    }
    return `${title}`
}