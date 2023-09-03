
interface FileChunk {
    chunkNumber: number;//分片编号
    totalChunks: number;//总分片， 后端在chunkNumber === totalChunks时应该执行chunk 合并操作 
    chunk: Blob// 分片
    chunkSize: number;//分片大小
    fileName:string,
    fileType:string
}
const createChunks: (file: File, splitChunkSize: number) => FileChunk[] = (file, splitChunkSize) => {
    // TODO: 完成分片逻辑
    let chunks = [] as  FileChunk[]
    const chunkSize = splitChunkSize * 1024 * 1024
    const chunksLength = Math.ceil(file.size / chunkSize)
    for(let i = 0; i < chunksLength;i++){
        const chunk = file.slice(i*chunkSize,i*chunkSize + chunkSize)
        chunks.push({
            chunk:chunk,
            chunkNumber:i+1,
            chunkSize:chunk.size,
            totalChunks:chunksLength,
            fileName:file.name,
            fileType:file.type
        })
    }

    return chunks
}


interface ChunkList {
    [x: string]: FileChunk[]
}

interface Split2ChunkList {
    (fileList: FileList, splitChunkSize: number): ChunkList
}
const split2ChunkList: Split2ChunkList = (fileList, splitChunkSize) => {
    let ChunkList = {} as ChunkList;
    for (let file of fileList) {
        // 如果指定分片大小大于文件大小，那么就不需要分片，直接将这个文件转为 FileChunk 返回
        if (file.size <= splitChunkSize * 1024 * 1024) {
            ChunkList[file.name] = [{
                chunk:file.slice(0, file.size, 'application/json'),
                chunkSize:file.size,
                chunkNumber:1,
                totalChunks:1
            }]
        }else{
            // 执行分片操作
            ChunkList[file.name] = createChunks(file,splitChunkSize)
        }
    }
    return ChunkList
}

export default split2ChunkList;