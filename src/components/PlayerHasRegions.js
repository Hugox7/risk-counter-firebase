import React from 'react';
import { firestore } from '../config/firebase';
import { Button } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import castle from '../assets/castle.png';
import harbor from '../assets/rudder.png';

class PlayerHasRegions extends React.Component {

    state = {
        regions: [],
    }

    async componentDidMount() {
        const regions = await this.getPlayerRegions();
        this.setState({ 
            regions,
         });
    }

    componentDidUpdate = async (prevProps, prevState) => {
        if (prevProps.loading !== this.props.loading) {
            this.setState({ regions: await this.getPlayerRegions() });
        }
    }

    getPlayerRegions = async () => {
        let playerRegions = [];
        const regionsRef = await firestore.collection('games')
            .doc(this.props.game.id)
            .collection('players')
            .doc(this.props.player.id)
            .collection('regions')
            .get();
        
        regionsRef.forEach(region => {
            playerRegions.push(region.data());
        });
        return playerRegions;
    }

    handleDeleteRegion = async (e, region) => {
        e.preventDefault();

        const PlayerRegionsRef = firestore.collection('games')
            .doc(this.props.game.id)
            .collection('players')
            .doc(this.props.player.id)
            .collection('regions')
            .doc(region.name)

        const regionsRef = firestore.collection(`games/${this.props.game.id}/regions`)

        try {
            await PlayerRegionsRef.delete();
            await regionsRef.doc(region.name).set(region);
            await this.props.updateCheckbox(this.props.game.id);
            await this.setState({ regions: await this.getPlayerRegions() });
        } catch (error) {
            console.log(error);
        }
              
    }

    render() {

        const style = {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '28px',
        }

        return (
            <div>
                <p>{`Régions : ${this.state.regions.length} / ${this.props.player.max}`}</p>
                {this.state.regions.map(region => {
                    return (
                        <div id="display-region-name" style={style} key={region.id}>
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <p style={{ margin: 0 }}>{region.name}</p>
                                {region.hasCastle 
                                    ? <img style={{ height: '22px', marginLeft: '10px' }} src={castle} alt="logo chateau" />
                                    : null
                                }
                                {region.hasHarbor 
                                    ? <img style={{ height: '22px', marginLeft: '10px' }} src={harbor} alt="logo port" />
                                    : null
                                }
                            </div>
                            <Button 
                                style={{ height: '100%' }} icon={<DeleteOutlined />} 
                                onClick={(e) => this.handleDeleteRegion(e, region) }
                            />
                        </div>
                    ); 
                })}
            </div>
        );
    }
}

export default PlayerHasRegions;