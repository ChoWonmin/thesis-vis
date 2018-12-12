class NetworkManager {

    constructor() {
    }

    async makeNetwork(group, representativeThesisId, groupColor) {
        if (_.isNil(this.network)) {
            const response = await axios.post('http://dblp.ourguide.xyz/papers/network', {
                group: group
            });

            const receivedData = response.data;
            console.log('received networkData : ', receivedData);

            // hsl 로 만든 그룹 Color
            const hslGroupColor = hexToHsl(groupColor);

            // 대표 논문의 연도
            let representativeThesisYear = _.find(receivedData.node, {
                _id: representativeThesisId
            }).year;

            // networkData를 다시 여기 상황에 맞게 정제한다.
            const nodes = new vis.DataSet(
                _.map(receivedData.node, (node) => {
                    // 제목에 연도를 붙이고
                    node.title = [node.title, ', ', node.year].join('');
                    // node.title 이 글의 length가 30의 배수일 때마다, <br>을 넣는다.
                    const countForProcess = parseInt(node.title.length / 30);
                    for (let i = 0; i < countForProcess; i++) {
                        node.title = [node.title.slice(0, (((i + 1) * 30) + (i * 4))), '<br>', node.title.slice((((i + 1) * 30) + (i * 4)))].join('');
                    }

                    if (representativeThesisId !== node._id) {
                        return {
                            id: node._id,
                            title: node.title,
                            color: `hsl(${hslGroupColor.h}, ${hslGroupColor.s}%,
                            ${hslGroupColor.l + (5 * Math.abs(node.year - representativeThesisYear))}%)`
                        }
                    } else { // 그룹장일 때
                        // representativeThesisYear = node.year;
                        return {
                            id: node._id,
                            title: node.title,
                            color: `hsl(${hslGroupColor.h}, ${hslGroupColor.s}%,
                            ${hslGroupColor.l}%)`,
                            size: 35
                        }
                    }

                })
            );

            // edge.value에 의해 length 최대 400(+25) 최소 150(+25)
            //                  width 최대 20 최소 1
            const maxEdgeValue = _.maxBy(receivedData.edges, (edge) => edge.value).value;
            const minEdgeValue = _.minBy(receivedData.edges, (edge) => edge.value).value;
            const diffMinMaxEdgeValue = maxEdgeValue - minEdgeValue;

            const edges = new vis.DataSet(
                _.map(receivedData.edges, (edge) => {
                    return {
                        from: edge.from,
                        to: edge.to,
                        length: 150 + 250 * ((maxEdgeValue - edge.value) / diffMinMaxEdgeValue),
                        width: 6 - 5 * ((maxEdgeValue - edge.value) / diffMinMaxEdgeValue)
                    }
                })
            );

            // create a network
            const container = document.getElementById('mynetwork');

            const networkData = {
                nodes: nodes,
                edges: edges
            };

            const options = {
                nodes: {
                    shape: 'dot', // circle 하면 크기 조절이 안됨
                    size: 20,
                    color: {
                        background: 'skyblue',
                        border: 'blue',
                        highlight: {
                            border: '#2B7CE9',
                            background: '#D2E5FF'
                        },
                        hover: {
                            border: 'red',
                            background: 'yellow'
                        }
                    }
                },
                edges: {
                    // color: {
                    //     color: '#512da8',
                    //     inherit: false // false 해줘야 노드의 색상이 적용되지 않는다.
                    // },
                    smooth: false
                },
                interaction: { // 드래그 되는지, 호버가 되는지 이런거
                    hover: true,
                    hoverConnectedEdges: false, // false 하면, node 색상이 잘 호버가 된다.
                    tooltipDelay: 200,
                }
            };

            this.network = new vis.Network(container, networkData, options);
        }
    }

    destroyNetwork() {
        if (!_.isNil(this.network)) {
            this.network.destroy();
            this.network = null;
        }
    }


}

// const networkManager = new NetworkManager();
// networkManager.makeNetwork([
//         "4be8eaca-a28a-4382-86c2-9314735066bd",
//         "7281e056-a2f6-4df3-bd54-fbd8ed8b737c",
//         "78efca65-ac1a-49bd-92ec-c8f0770fefb8",
//         "7d911d74-c4c1-4d4d-a737-5cf51e404c83",
//         "85bd9cc6-e41a-4fd4-8f3b-e776329efc4b",
//         "aa16086f-f3bf-432a-bfcd-9f1521c9ac52",
//         "cab91964-4e8d-4211-8d32-455cfd690b60",
//         "dc00221e-92c4-4ee4-8a7b-666ab5fd28c5",
//         "ea9489be-45f6-482f-937c-11b644d5f2ce",
//         "f258af24-e04a-49d4-86c3-1ab1c2f43914",
//         "fa96abdc-7c09-419b-a00d-4c24d5879eeb"
//     ],
//     "4be8eaca-a28a-4382-86c2-9314735066bd",
//     '#311B92');

// 네트워크 파괴
// setTimeout(() => {
//     networkManager.destroyNetwork();
// }, 2000);
