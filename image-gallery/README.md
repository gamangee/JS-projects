# 이미지 갤러리

![img-gallery.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/9cbd7577-31d2-4847-9bae-6da47e9b0480/img-gallery.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230117%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230117T135104Z&X-Amz-Expires=86400&X-Amz-Signature=ff24ee2206bda00e1e60fa72cfa4e8b6fcdb84af94ea5e2213c9c0043337d101&X-Amz-SignedHeaders=host&x-id=GetObject)

# 구현 기능

- 여러 장의 이미지를 2가지 방법으로(클릭, 드래그) 올릴 수 있는 갤러리 구현
- 드래그 이벤트는 Dragzone 라이브러리 사용

# 작업하면서 어려웠던 점

### 파일 여러 장 올리기

`FileReader` 객체로 이미지 파일의 url 소스를 불러와서 useState 배열에 담아주면 된다고 생각했다. 하지만 for문을 돌려서 하나 하나 담아줬어야 겠다는 생각은 또 나지 않았다.

`해결`

```jsx
// 이미지 파일 url을 담을 배열
// 추후 ImageBox 컴포넌트 src에 넣어줄 것이다.
const [imgList, setImgList] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
// 여러장의 이미지 파일을 올릴 때 마다
// for문으로 하나씩 imgList 배열에 담아준다.
      for (const file of acceptedFiles) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = (e) => {
          setImgList((prev) => [...prev, e.target?.result as string]);
        };
      }
    }
  }, []);
```

이미지 파일을 올릴 때 쓰는 메소드들이 익숙하지 않았다. 이참에 자주 쓰는 것들은 눈에 익힐 필요가 있을 거 같다.

# 새롭게 알게된 점

### FileReader.readAsDataURL vs URL.createObjectURL

input 태그에서 type이 file로 이미지를 올리고 url을 가져올 때 구글링을 하면 `readAsDataURL`와 `createObjectURL` 이 2가지가 자주 나왔다.

2가지의 차이점이 궁금해서 정리해보았다.

|        | readAsDataURL                                                                                       | createObjectURL                                                                                        |
| ------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| 시간   | 비동기 / 일정 시간 후 실행                                                                          | 동기 / 즉시 실행                                                                                       |
| 반환   | base64로 인코딩된 값을 반환                                                                         | hash 형태의 url을 반환                                                                                 |
| 메모리 | createObjectURL에 비해 메모리를 많이 잡아먹지만, 사용하지 않으면 자동으로 가비지 컬렉터에 의해 제거 | revokeObjectURL 메서드가 실행되거나 브라우저가 닫히는 이벤트가 트리거 되기 전까지 메모리에 객체를 저장 |
| 특이점 |                                                                                                     | 사용하지 않을 때 일일이 revokeObjectURL로 release시켜주어야 한다.                                      |

# Dropzone 라이브러리 사용

![dragndrop.gif](https://s3.us-west-2.amazonaws.com/secure.notion-static.com/b93244d8-eb4d-49be-a6c1-6493f7b71894/dragndrop.gif?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAT73L2G45EIPT3X45%2F20230117%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20230117T143104Z&X-Amz-Expires=86400&X-Amz-Signature=cf2e8787d864ab0aefe1b405c201a3b0191587d78bbe7b374501746c1a6c9453&X-Amz-SignedHeaders=host&x-id=GetObject)

라이브러리를 설치하여 간단하게 드래그하여 파일을 올릴 수 있는 기능을 구현하였다.

Dropzone 컴포넌트를 import해서 불러오면 라이브러리에서 제공하는 기능을 손쉽게 사용할 수 있다.
