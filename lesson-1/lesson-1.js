const memoFeed = async () => {
    const url = 'https://graph.cash/graphql';
    const query = `
            query {
                posts_newest {
                    lock {
                        address
                    }
                    tx {
                        hash
                        seen
                        blocks {
                            block {
                            hash
                            timestamp
                          }
                        }
                    }
                    text
                }
            }
        `;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: query
        })
    });

    const json = await response.json();
    const feed = document.getElementById('memo-feed');

    json.data.posts_newest.splice(0, 10).forEach(post => {
        const addressInfo = `Address: ${post.lock.address}`;
        const txInfo = `Tx: ${formatHash(post.tx.hash)} ${formatDate(post.tx.seen)}`;
        const postText = `${post.text}`;

        const divCard = newElement("div", ["card"]);
        const divCardBody = newElement("div", ["card-body"]);
        const divPostText = newElement("h5", ["card-title"], postText);
        const divAddressInfo = newElement("div", ["card-text"], addressInfo);
        const divTxInfo = newElement("div", ["card-text"], txInfo);
        const aMemoLink = newElement("a", ["card-link"], "View on Memo");

        let blockInfo;
        if (post.tx.blocks && post.tx.blocks.length) {
            const block = post.tx.blocks[0].block;
            blockInfo = `Block: ${formatHash(block.hash)} ${formatDate(block.timestamp)}`;
        } else {
            blockInfo = `Unconfirmed tx`;
        }
        const divBlockInfo = newElement("div", ["card-text"], blockInfo);

        aMemoLink.href = `https://memo.cash/post/${post.tx.hash}`;
        aMemoLink.target = "memo";

        divCard.append(divCardBody);
        divCardBody.append(divPostText);
        divCardBody.append(divAddressInfo);
        divCardBody.append(divTxInfo);
        divCardBody.append(divBlockInfo);
        divCardBody.append(aMemoLink);

        feed.appendChild(divCard);
    });
};
const newElement = (tag, classes, text) => {
    const ele = document.createElement(tag);
    ele.classList.add(...classes);
    ele.textContent = text;
    return ele;
};
const formatDate = (str) => {
    const options = {hour: "numeric", minute: "numeric"}
    return new Date(str).toLocaleDateString('en-us', options);
}
const formatHash = (str) => {
    if (str.length <= 15) {
        return str
    }
    return `${str.substring(0, 6)}...${str.slice(-6)}`
}
memoFeed().then();
