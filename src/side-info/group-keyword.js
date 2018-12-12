class GroupKeyword {
    constructor() {

    }

    async makeView(group) {
        // 서버에서 가져오기
        try {
            const response = await axios
                .post('http://dblp.ourguide.xyz/papers/topic', {
                    group: group,
                    // value: "5"
                });
            const keywords = response.data; // array
            console.log('keywords : ', keywords);
            const maxCountOfKeywords = keywords[0].count;

            // 컨텐츠들 띄우기
            _.forEach(keywords, (keywordUnit) => {
                const template = `
                    <div class="keyword-unit">
                        <div class="keyword">${keywordUnit.keword}</div>
                        <div class="bar-graph-zone">
                            <div class="bar-graph"></div>
                        </div>
                        <div class="count">${keywordUnit.count}회</div>
                    </div>
                    `;

                const $template = $(template);
                $template.find('.bar-graph')
                    .css('width', keywordUnit.count / maxCountOfKeywords * 120);
                $('.group-keyword').append($template);
            });
        } catch (error) {
            console.log(error);
        }

    }

    destroyView() {
        $('.keyword-unit').remove();
    }
}

// const groupKeyword = new GroupKeyword();
// groupKeyword.makeView();
