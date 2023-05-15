const main = document.querySelector('main');

(async () => {    
    await loadContent(window.location.hash)
    
    addEventListener("hashchange", async () => {
        await loadContent(window.location.hash)
    })
})()

async function loadContent(urlPath) {
    if (urlPath.startsWith('#/post')) {
        const p = document.createElement('p')

        const postId = urlPath.replace('#/post/', '')
        if (!postId) {
            p.innerText = 'no postId specified'
            return document.body.append(p)
        }

        const res = await fetch(`https://blog-api.losing.top/post?postId=${postId}`)
            .catch(() => {
                p.innerText = 'something went wrong'
                document.body.append(p)
            })

        const post = await res.json()

        if (post.error) {
            p.innerText = 'post not found'
            return document.body.append(p)
        }

        const title = document.querySelector('head > title')
        title.innerText = `${post.title} | losing's blog`

        const template = document.querySelector('template#post')
        const postElement = template.content.cloneNode(true)

        if (post?.tags) {
            const tagsWrapper = postElement.querySelector('.tags')

            for (const tag of post.tags) {
                const tagElement = document.createElement('a')
                tagElement.classList.add('tag')
                tagElement.setAttribute('href', `/#/tag/${tag}`)
                tagElement.innerText = tag
                tagsWrapper.append(tagElement)
            }
        } else
            postElement.querySelector('.tags').remove()

        post?.image ? postElement.querySelector('.image').setAttribute('src', post.image) : postElement.querySelector('.image').remove()
        postElement.querySelector('.title').innerText = post.title
        post?.description ? postElement.querySelector('.description').innerText = post.description : postElement.querySelector('.description').remove()
        postElement.querySelector('.details').innerText = `By ${post.author.displayName}`
        postElement.querySelector('.dates').innerText = `Created: ${new Date(post.createdDate).toLocaleDateString()} ${new Date(post.createdDate).toLocaleTimeString()}\n Changed: ${new Date(post.updatedDate).toLocaleDateString()} ${new Date(post.updatedDate).toLocaleTimeString()}`
        postElement.querySelector('.content').innerHTML = marked.parse(post.content)

        const wrapper = document.createElement('div')
        wrapper.classList.add('post')

        wrapper.append(postElement)
        main.append(wrapper)
    } else {
        const p = document.createElement('p')
        p.innerText = 'not found'
        main.append(p)
    }
}
