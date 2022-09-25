export const funDownload = function ({
    content,
    fileName,
    fileType
}:{
    content : any;
    fileName: string;
    fileType: string;
}, cb?: Function) {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = fileName;
    eleLink.style.display = 'none';
    let type = '';
    if(['xlsx'].indexOf(fileType) !== -1){
        console.log("xlsx");
        type = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8';
    }else if (['xls'].indexOf(fileType) !== -1) {
        type = 'application/vnd.ms-excel'
    }
    // 字符内容转变成blob地址
    var blob = new Blob([content], {
        type
    });
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
    cb && cb()
};



// 从资源url中获取资源并下载
interface IDownloadByUrl {
    resourceUrl?: string, // 资源url
    fileName?: string, // 下载后的文件名
}
export function downloadByUrl(params: IDownloadByUrl = {}) {
    return new Promise((resolve, reject) => {
        const { resourceUrl, fileName = resourceUrl.split("/").pop().split("?")[0] } = params;
        if(!resourceUrl) return;
        
        const xhr = new XMLHttpRequest();
        xhr.open( "GET", resourceUrl, true);
        xhr.responseType = 'blob';
        xhr.onload = ({target}: any) => {
            if(target.status === 200) {
                const anchor = document.createElement("a");
                anchor.href = URL.createObjectURL(target.response); // template blob url
                anchor.download = fileName;
                anchor.style.display = "none";
                document.body.appendChild(anchor);
                anchor.click();
                document.body.removeChild(anchor);
                URL.revokeObjectURL(anchor.href);
                return resolve({...params, ...target});
            }
            return reject({...params, ...target});
        }
        //@ts-ignore
        xhr.rawSend();
    })
}