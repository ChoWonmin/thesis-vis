class RepresentativeThesis {
    constructor() {

    }

    async makeView(representativeThesisId) {
        // 서버에서 가져오기
        try {
            const response = await axios
                .get(`http://dblp.ourguide.xyz/papers/${representativeThesisId}/info`);
            const thesisData = response.data;
            console.log('thesisData : ',thesisData);

            // 컨텐츠들 띄우기
            $('.thesis-title-content').text(thesisData.title);
            $('.thesis-author-content').text(_.join(thesisData.authors, ', '));
            $('.thesis-paper-keyword-content').text(_.join(thesisData.keyword, ', '));

        } catch (error) {
            console.log(error);
        }
    }

    destroyView() {

    }

}

// const representativeThesis = new RepresentativeThesis();
// representativeThesis.makeView();
